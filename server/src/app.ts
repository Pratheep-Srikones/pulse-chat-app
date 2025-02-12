import express from "express";
import cors from "cors";
import authRoutes from "../routes/auth.routes";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);

export default app;
