import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import { app, server } from "./utils/socket";
import config from "./config/env.config";
import { connect_db } from "./utils/database";

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "5mb" }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

const port = config.port;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connect_db();
});
