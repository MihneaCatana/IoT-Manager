import mongoose from "mongoose";

const deviceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["sensor", "actuator", "gateway", "controller", "other"], // Adjust as needed
  },
  status: {
    type: String,
    enum: ["online", "offline", "error", "maintenance"],
    default: "offline",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Device = mongoose.model("Device", deviceSchema);

export default Device;
