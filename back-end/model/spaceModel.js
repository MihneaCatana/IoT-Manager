import mongoose from "mongoose";
import { deviceSchema } from "./deviceModel.js";

const spaceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    enum: ["smart-home", "factory", "warehouse"],
    default: "smart-home",
  },
  status: {
    type: String,
    enum: ["inactive", "active", "maintenance"],
    default: "inactive",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  devices: {
    type: [deviceSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Space = mongoose.model("Space", spaceSchema);

export default Space;
