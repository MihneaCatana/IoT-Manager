import express from "express";
import "dotenv/config";
import router from "./routes/index.js";
import mongoose from "mongoose";
import cors from "cors";
// import kafka from "./config/config.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", router);

try {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected with success to MongoDb");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  });
} catch (error) {
  console.log("Couldn't connect to the database, error:", error);
}

// kafka.consumeMessage("my-topic", (value) => {
//   console.log(value);
// });
