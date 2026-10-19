import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";



dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
