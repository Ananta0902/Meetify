import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import UserRoutes from "./src/routes/users.routes.js"; 
import { connectToSocket } from "./src/controllers/socketManager.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

app.use("/api/v1/users", UserRoutes);
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK"
    });
});
const server = createServer(app);

connectToSocket(server);

const PORT = process.env.PORT || 8000;

const start = async () => {
    try {
        const connectionDb = await mongoose.connect(process.env.MONGO_URL);

        console.log(`MongoDB connected: ${connectionDb.connection.host}`);

        server.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });

    } catch (err) {
        console.error("Database connection failed:", err);
    }
};

start();