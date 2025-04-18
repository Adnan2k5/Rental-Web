import { Message } from "../models/message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
/**
 * Socket.IO initialization and event handlers
 */
const initSocketIO = (io) => {
    const userSocketMap = new Map();
    io.on("connection", (socket) => {
        // Listen for user joining a room
        socket.on("joinRoom", async ({userId}) => {
            try {
                userSocketMap.set(userId, socket.id);
                socket.join(userId);
                console.log(`User ${userId} joined room: ${socket.id}`);
            }
            catch (error) {
                console.error(`Error joining room for user ${userId}:`, error);
            }
        });

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
        socket.on("sendMessage", async ({ userId, message }) => {
            try {
                const isOnline = userSocketMap.has(userId);

                await Message.create({
                    from: message.from,
                    to: userId,
                    content: message.content,
                    timestamp: new Date(),
                    isRead: false,
                });
        
                if (isOnline) {
                    io.to(userId).emit("receiveMessage", message);
                } 
            }
            catch(e) {
                console.error(`Error sending message from ${message.from} to ${userId}:`, e);
            }
        });

        // Mark message as read
        socket.on("markAsRead", async ({ messageId }) => {
            try {
                const message = await Message.findById(messageId);
                if (message) {
                    message.isRead = true;
                    await message.save();
                }
            }
            catch(e) {
                console.error(`Error marking message as read:`, e);
            }
        });
    });
};

export default initSocketIO;
