import express from "express";
import "dotenv/config";
import router from "./routes/index.js";
// import kafka from "./config/config.js";

const app = express();

app.use(express.json());
app.use("/api", router);

// kafka.consumeMessage("my-topic", (value) => {
//   console.log(value);
// });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
