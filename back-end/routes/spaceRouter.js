import express from "express";
import spaceController from "../controller/spaceController.js";
const router = express.Router();

router.post("/", spaceController.create);
router.post("/addDevice/:spaceId", spaceController.createDeviceAndAddToSpace);

router.get("/", spaceController.getAll);
router.get("/:userId/:id", spaceController.getOne);

router.put("/:id", spaceController.updateOne);

router.delete("/:spaceId", spaceController.delete);

export { router as SpaceRouter };
