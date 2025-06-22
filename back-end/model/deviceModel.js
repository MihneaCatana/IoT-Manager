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
    enum: [
      "sensor",
      "actuator",
      "gateway",
      "controller",
      "other",
      "thermostat",
      "camera",
    ], // Adjust as needed
  },
  status: {
    type: String,
    enum: ["online", "offline", "error", "maintenance"],
    default: "offline",
  },
  space: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Space",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  batteryLevel: {
    type: Number,
    default: 0,
  },
  temperature: {
    type: Number,
    default: 0,
  },
  humidity: {
    type: Number,
    default: 0,
  },
  powerConsumption: {
    type: Number,
    default: 0,
  },
  firmware: {
    type: String,
    default: "v1.0.0",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Device = mongoose.model("Device", deviceSchema);

export default Device;
