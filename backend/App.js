import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import UserRoutes from "./src/routes/users.routes.js"; 
import { connectToSocket } from "./src/controllers/socketManager.js";
import aiRoutes from './src/routes/aiRoutes.js';

dotenv.config();

const app = express();
import path from 'path';


// Get absolute path of current folder to prevent route mismatch
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load the .env file from the absolute backend root path
dotenv.config({ path: path.resolve(__dirname, '.env') });

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/ai', aiRoutes);

// ... your existing server.listen or socket setups down here
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

app.use("/api/v1/users", UserRoutes);
app.use(express.json()); // Ensure your server parses JSON bodies
// Mount the AI endpoint
app.use('/api/ai', aiRoutes);
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