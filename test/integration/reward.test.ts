import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../app-test.js";
import { userService } from "../../src/services/user-service.js";
import { Reward } from "../../src/schemas/reward-schema.js";
import { redisServer } from "../../src/lib/redis-cache.js";
import { signToken } from "../../src/utils/jwt-util.js";

let mongoServer: MongoMemoryServer;
let ownerToken: string;
let otherUserToken: string;
let ownerId: string;
let rewardId: string;

const owner = {
  name: "Reward Owner",
  email: "reward-owner@example.com",
  password: "Password123",
};

const otherUser = {
  name: "Other User",
  email: "other-user@example.com",
  password: "Password123",
};

const reward = {
  title: "Early access",
  description: "Access to the first release",
  min_pledge: 50,
  remaining: 10,
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  await redisServer.connect();
  await redisServer.client.flushDb();

  const ownerDocument = await userService.create(owner);
  const otherUserDocument = await userService.create(otherUser);
  ownerId = ownerDocument.id;
  ownerToken = signToken({
    email: owner.email,
    id: ownerId,
  }).token;
  otherUserToken = signToken({
    email: otherUser.email,
    id: otherUserDocument.id,
  }).token;
});

afterAll(async () => {
  await Reward.deleteMany({});
  await redisServer.client.flushDb();
  await redisServer.client.quit();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Reward endpoint", () => {
  it("returns an empty list when there are no rewards", async () => {
    const res = await request(app).get("/api/reward");

    expect(res.status).toBe(200);
    expect(res.body.result).toEqual([]);
  });

  it("requires authentication to create a reward", async () => {
    const res = await request(app).post("/api/reward").send(reward);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Missing or malformed Authorization header");
  });

  it("rejects an invalid reward body", async () => {
    const res = await request(app)
      .post("/api/reward")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ title: "No" });

    expect(res.status).toBe(400);
    expect(res.body.data).toBe("Please complete all the fields");
  });

  it("creates a reward for the authenticated user", async () => {
    const res = await request(app)
      .post("/api/reward")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send(reward);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(reward.title);
    expect(res.body.created_by).toBe(ownerId);
    rewardId = res.body._id;
  });

  it("returns all rewards", async () => {
    const res = await request(app).get("/api/reward");

    expect(res.status).toBe(200);
    expect(res.body.result).toHaveLength(1);
    expect(res.body.result[0].title).toBe(reward.title);
  });

  it("updates a reward owned by the authenticated user", async () => {
    const res = await request(app)
      .put(`/api/reward/${rewardId}`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ remaining: 5 });

    expect(res.status).toBe(200);
    expect(res.body.result.remaining).toBe(5);
  });

  it("does not allow another user to update the reward", async () => {
    const res = await request(app)
      .put(`/api/reward/${rewardId}`)
      .set("Authorization", `Bearer ${otherUserToken}`)
      .send({ remaining: 1 });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Resource not found");
  });

  it("rejects an invalid reward id", async () => {
    const res = await request(app)
      .delete("/api/reward/not-an-id")
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Please send a valid id");
  });

  it("deletes a reward owned by the authenticated user", async () => {
    const res = await request(app)
      .delete(`/api/reward/${rewardId}`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.result._id).toBe(rewardId);
    expect(await Reward.exists({ _id: rewardId })).toBeNull();
  });

  it("returns 404 when deleting a missing reward", async () => {
    const res = await request(app)
      .delete(`/api/reward/${rewardId}`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Resource not found");
  });
});
