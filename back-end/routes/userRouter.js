import express from "express";
import userController from "../controller/userController.js";
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);

export { router as UserRouter };
