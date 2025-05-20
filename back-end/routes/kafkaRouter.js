import express from "express";
import kafkaController from "../controller/kafkaController.js";
const router = express.Router();

router.post("/send", kafkaController.sendMessageToKafka);

export { router as KafkaRouter };
