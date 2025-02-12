import mongoose from "mongoose";

import config from "../config/env.config";
export const connect_db = async () => {
  try {
    const conn = await mongoose.connect(config.dbURL);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};
