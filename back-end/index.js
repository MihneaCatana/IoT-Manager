import express from "express";
import "dotenv/config";
import router from "./routes/index.js";
import mongoose from "mongoose";
// import kafka from "./config/config.js";

const app = express();

app.use(express.json());
app.use("/api", router);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected with success to MongoDb");
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});

// kafka.consumeMessage("my-topic", (value) => {
//   console.log(value);
// });
