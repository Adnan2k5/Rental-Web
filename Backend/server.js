import dotenv from "dotenv";
dotenv.config({path: "./.env"});

import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.config.js";
import authRoute from "./routes/auth.routes.js"
import userRoute from "./routes/user.routes.js"
import itemRoute from "./routes/item.routes.js"
import { initCloudinary } from "./utils/cloudinary.js";


const app = express();
// Create HTTP server using Express app
const server = createServer(app);
// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Socket.IO connection handlers
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Handle chat messages
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });
    
    // Join a room (for private messaging)
    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });
    
    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/item", itemRoute);
app.use("/api/user", userRoute);

const PORT = process.env.PORT || 8080;
// Use 'server' instead of 'app' to listen
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    initCloudinary();
});