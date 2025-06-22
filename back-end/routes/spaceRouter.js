import express from "express";
import spaceController from "../controller/spaceController.js";
const router = express.Router();

router.post("/", spaceController.create);

router.get("/", spaceController.getAll);
router.get("/:userId/:id", spaceController.getOne)

router.put("/:id", spaceController.updateOne)

export { router as SpaceRouter };
