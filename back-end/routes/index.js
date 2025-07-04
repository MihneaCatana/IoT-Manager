import express from "express";
const router = express.Router();
import { KafkaRouter } from "./kafkaRouter.js";
import { UserRouter } from "./userRouter.js";
import { DeviceRouter } from "./deviceRouter.js";
import { SpaceRouter } from "./spaceRouter.js";
import { OtherRouter } from "./otherRouter.js";

router.use("/kafka", KafkaRouter);
router.use("/user", UserRouter);
router.use("/device", DeviceRouter);
router.use("/space", SpaceRouter);
router.use("/other", OtherRouter);

export default router;
