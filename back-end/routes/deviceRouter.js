import express from "express";
import deviceController from "../controller/deviceController.js";
const router = express.Router();

router.post("/", deviceController.create);
router.get("/", deviceController.getAll);
router.get("/:id", deviceController.getOne);

export { router as DeviceRouter };
