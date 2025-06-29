import express from "express";
import otherController from "../controller/otherController.js";
const router = express.Router();

router.post("/generate", otherController.generateMockData);
router.post("/reset", otherController.resetDb);
router.post("/publish", otherController.generateMessages);

export { router as OtherRouter };
