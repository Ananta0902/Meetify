import express, { urlencoded } from "express";
import {createServer} from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./src/controllers/socketManager.js";
const app=express();
const server=createServer(app);
const io=connectToSocket(server);
import UserRoutes from "./src/routes/users.routes.js";

//import { env } from "node:process";
import dotenv from "dotenv";
dotenv.config();

app.set("port",(process.env.token || 8000));
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extendend:true}));

app.use("/api/v1/users",UserRoutes);
//app.use("api/v2/users",newUserRoute);

const start=async()=>{
    const connectionDb=await mongoose.connect(process.env.MONGO_URL);
    console.log(`Mongo Db connected host: ${connectionDb.connection.host}`);
    server.listen(app.get("port"),()=>{
        console.log("listening");
    });
}

start();