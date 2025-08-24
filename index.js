require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const appRouter = require("./src/router");
const { connectDB } = require("./src/config/db");
const socketHandler = require("./src/sockets/socket");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(cors());

app.use(express.json());

(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.log("Failed to connect to the database:", err);
    return;
  }
})();

socketHandler(io);

app.use("/api", appRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

httpServer.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
