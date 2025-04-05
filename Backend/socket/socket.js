/**
 * Socket.IO initialization and event handlers
 */
const initSocketIO = (io) => {
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
};

export default initSocketIO;
