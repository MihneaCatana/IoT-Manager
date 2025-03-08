import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import controllers from "./controller/kafkaController.js";
import kafka from "./config/config.js";

const app = express();
const jsonParser = bodyParser.json();
app.use(express.json());

app.post("/api/send", jsonParser, controllers.sendMessageToKafka);

kafka.consumeMessage("my-topic", (value) => {
  console.log(value);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
