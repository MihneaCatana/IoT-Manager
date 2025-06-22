import mongoose from "mongoose";

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
    default: "",
  },
  status: {
    type: String,
    default: "Inactive",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  devices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Space = mongoose.model("Space", spaceSchema);

export default Space;
