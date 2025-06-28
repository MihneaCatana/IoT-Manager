import express from "express";
import otherController from "../controller/otherController.js";
const router = express.Router();

router.post("/generate", otherController.generateMockData);
router.post("/reset", otherController.resetDb);

export { router as OtherRouter };
