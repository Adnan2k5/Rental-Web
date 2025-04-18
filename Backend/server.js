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
import cartRoute from "./routes/cart.routes.js"
import ticketRoute from "./routes/ticket.routes.js"
import messageRoute from "./routes/message.routes.js"
import { initCloudinary } from "./utils/cloudinary.js";
import initSocketIO from "./socket/socket.js";

const app = express();
// Create HTTP server using Express app
const server = createServer(app);
// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize Socket.IO with event handlers
initSocketIO(io);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/item", itemRoute);
app.use("/api/user", userRoute);
app.use("/api/cart", cartRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/messages", messageRoute);

const PORT = process.env.PORT || 8080;
// Use 'server' instead of 'app' to listen
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    initCloudinary();
});