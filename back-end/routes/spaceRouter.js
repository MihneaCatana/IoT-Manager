import express from "express";
import spaceController from "../controller/spaceController.js";
const router = express.Router();

router.post("/", spaceController.create);
router.get("/", spaceController.getAll);

export { router as SpaceRouter };
