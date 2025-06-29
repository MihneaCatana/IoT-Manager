import mongoose from "mongoose";

const deviceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true, // Adjust as needed
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
  events: {
    timestamp: {
      type: Date,
      default: Date.now,
    },
    batteryLevel: {
      type: Number,
    },
    temperature: {
      type: Number,
    },
    humidity: {
      type: Number,
    },
    powerConsumption: {
      type: Number,
      default: 0,
    },
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

export { Device, deviceSchema };
