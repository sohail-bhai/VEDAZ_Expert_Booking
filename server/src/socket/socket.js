const { Server } = require("socket.io");

let io;

const initSocket = (httpServer) => {
  // Support multiple origins for local, Railway, and Vercel
  const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
    : ["http://localhost:5173"];

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Used by controllers to emit events without passing io around
const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };
