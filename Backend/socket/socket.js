import { Message } from "../models/message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
/**
 * Socket.IO initialization and event handlers
 */
const initSocketIO = (io) => {
    const userSocketMap = new Map();
    io.on("connection", (socket) => {
        // Listen for user joining a room
        socket.on("joinRoom", asyncHandler( async (userId) => {
            userSocketMap.set(userId, socket.id);
            socket.join(userId);
            console.log(`User ${userId} joined room: ${socket.id}`);

            const pendingMessages = await Message.find({ to: userId, isRead: false });
            if (pendingMessages.length > 0) {
                socket.emit("pendingMessage", pendingMessages);
            }
        }));

        // Listen for user disconnecting
        socket.on("disconnect", () => {
            // Find the user by socket ID
            for(const [userId, socketId] of userSocketMap.entries()) {
                if(socketId === socket.id) {
                    userSocketMap.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });

        // Send Message to a specific user
        socket.on("sendMessage", asyncHandler(async ({ userId, message }) => {
            const isOnline = userSocketMap.has(userId);

            await Message.create({
                from: message.from,
                to: userId,
                content: message.content,
                timestamp: message.timestamp,
                isRead: false,
            });

            if (isOnline) {
                io.to(userId).emit("receiveMessage", message);
            } 
        }));

        // Mark message as read
        socket.on("markAsRead", asyncHandler(async ({ messageId }) => {
            const message = await Message.findById(messageId);
            if (message) {
                message.isRead = true;
                await message.save();
            }
        }));
    });
};

export default initSocketIO;
