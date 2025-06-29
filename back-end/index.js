import express from "express";
import "dotenv/config";
import router from "./routes/index.js";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import kafka from "./config/config.js";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use("/api", router);
const io = new Server(server, {
  cors: { origin: "*" },
});

try {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected with success to MongoDb");
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  });
} catch (error) {
  console.log("Couldn't connect to the database, error:", error);
}

kafka.consumeMessage(process.env.TOPIC_NAME, io, (value) => {
  console.log(value);
});
