import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../app-test.js";
import { userService } from "../../src/services/user-service.js";
import { Otp } from "../../src/schemas/otp-schema.js";
import { encrypt } from "../../src/utils/encrypt-util.js";

let mongoServer: MongoMemoryServer;

const user = {
  name: "Ariel Molina",
  email: "arielmolina8953@gmail.com",
  password: "Ariel1234",
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  await userService.create(user);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Authentication endpoint", () => {
  it("returns 400 for invalid registration data", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Ar",
      email: "invalid-email",
      password: "short",
    });

    expect(res.status).toBe(400);
    expect(res.body.data).toBe("Please complete all the fields");
  });

  it("registers a user and creates an OTP without sending email", async () => {
    const email = "new-user@example.com";
    const res = await request(app).post("/api/auth/register").send({
      name: "New User",
      email,
      password: "Password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(email);
    expect(await Otp.exists({ email })).toBeTruthy();
  });

  it("returns 409 when the email is already registered", async () => {
    const res = await request(app).post("/api/auth/register").send(user);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("The account is already registered");
  });

  it("returns 400 for invalid login data", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "invalid-email",
      password: "short",
    });

    expect(res.status).toBe(400);
    expect(res.body.data).toBe("Please send a valid fields");
  });

  it("returns 401 for invalid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: "Wrong1234",
    });

    expect(res.status).toBe(401);
    expect(res.body.result).toBe("Invalid email or password");
  });

  it("returns an access token for valid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send(user);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged successfully");
    expect(res.body.accessToken).toEqual(expect.any(String));
  });

  it("returns 404 when the OTP does not exist", async () => {
    const res = await request(app).post("/api/auth/validate").send({
      email: "missing@example.com",
      code: "123456",
    });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Code not found");
  });

  it("returns 403 for an incorrect OTP", async () => {
    await Otp.create({
      email: user.email,
      code: await encrypt("123456"),
    });

    const res = await request(app).post("/api/auth/validate").send({
      email: user.email,
      code: "654321",
    });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Code is not correct");
  });

  it("verifies the user with a correct OTP", async () => {
    const email = "verified@example.com";
    await userService.create({
      name: "Verified User",
      email,
      password: "Password123",
    });
    await Otp.create({ email, code: await encrypt("123456") });

    const res = await request(app).post("/api/auth/validate").send({
      email,
      code: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User verified");
  });

  it("creates a new OTP when it is requested again", async () => {
    const email = "new-user@example.com";
    const before = await Otp.countDocuments({ email });

    const res = await request(app).post("/api/auth/resend_otp").send({
      email,
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User verified");
    expect(await Otp.countDocuments({ email })).toBe(before + 1);
  });
});
