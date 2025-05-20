import express from "express";
const router = express.Router();
import { KafkaRouter } from "./kafkaRouter.js";
import { UserRouter } from "./userRouter.js";
import { DeviceRouter } from "./deviceRouter.js";

router.use("/kafka", KafkaRouter);
router.use("/user", UserRouter);
router.use("/device", DeviceRouter);

export default router;
