import mongoose from "mongoose";
import "dotenv/config";

const URI = process.env.MONGO_URI;

export async function connectToMongo() {
  if (!URI) {
    throw new Error("Invalid URI");
  }

  await mongoose.connect(URI);
}
