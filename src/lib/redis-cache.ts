import { createClient } from "redis";
import "dotenv/config";

const redisUrl = process.env.REDIS_URI!;

if (!redisUrl) {
  throw new Error("The REDIS_URL variable is not define");
}

class RedisServer {
  client = createClient({
    url: redisUrl,
  });

  async connect() {
    this.client.on("error", (error) => {
      throw new Error(error);
    });

    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }
}

export const redisServer = new RedisServer();
