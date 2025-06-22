import express from "express";
import deviceController from "../controller/deviceController.js";
const router = express.Router();

router.post("/", deviceController.create);
router.get("/", deviceController.getAll);
router.get("/:id", deviceController.getOne);
router.put("/:id", deviceController.updateOne);
router.delete("/:id", deviceController.delete);

export { router as DeviceRouter };
