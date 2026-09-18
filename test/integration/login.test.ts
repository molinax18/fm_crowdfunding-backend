import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { userService } from "../../src/services/user-service.js";
import { app } from "../app-test.js";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  await userService.create({
    name: "Ariel Molina",
    email: "arielmolina8953@gmail.com",
    password: "Ariel1234",
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Authentication endpoint", () => {
  it("Should return 401 for incorrect email/password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("Accept", "application/json")
      .send({ email: "brianadenise123@gmail.com", password: "Briana1234" });

    expect(res.status).toBe(401);
    expect(res.body.result).toBe("Invalid email or password");
  });

  it("Should return 200 when a registered user provides correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("Accept", "application/json")
      .send({
        email: "arielmolina8953@gmail.com",
        password: "Ariel1234",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged successfully");
  });
});
