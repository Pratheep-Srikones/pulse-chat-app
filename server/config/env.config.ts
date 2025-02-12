import assert from "assert";
import dotenv from "dotenv";

dotenv.config();

const { NODE_ENV, PORT, HOST_URL, MONGODB_URL, JWT_SECRET } = process.env;

assert(PORT, "PORT is required");
assert(HOST_URL, "HOST_URL is required");
assert(MONGODB_URL, "MONGODB_URL is required");
assert(JWT_SECRET, "JWT_SECRET is required");
assert(NODE_ENV, "NODE_ENV is required");

export default {
  nodeEnv: NODE_ENV,
  port: parseInt(PORT),
  hostURL: HOST_URL,
  dbURL: MONGODB_URL,
  jwtSecret: JWT_SECRET,
};
