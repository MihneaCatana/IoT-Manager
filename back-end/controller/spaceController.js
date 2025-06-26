import { Device } from "../model/deviceModel.js";
import Space from "../model/spaceModel.js";
import deviceController from "./deviceController.js";

const spaceController = {
  create: async (req, res) => {
    try {
      const { name, location, type, owner } = req.body;

      // Validate required fields
      if (!name) {
        return res.status(400).json({ message: "Name is required." });
      }

      const newSpace = new Space({
        name,
        location,
        type,
        owner,
        devices: [],
      });

      const savedSpace = await newSpace.save();
      res.status(201).json({
        message: "Space registered successfully",
        space: savedSpace,
      });
    } catch (error) {
      console.error("Error creating space:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  getAll: async (req, res) => {
    try {
      const spaces = await Space.find().sort({
        createdAt: -1,
      });

      res.status(200).json({ spaces });
    } catch (error) {
      console.error("Error fetching spaces:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  getOne: async (req, res) => {
    try {
      const spaceId = req.params.id;
      const userId = req.params.userId;

      const space = await Space.findOne({ _id: spaceId, owner: userId });

      if (!space) {
        return res
          .status(404)
          .json({ message: "Space not found or access denied." });
      }

      res.status(200).json({ space });
    } catch (err) {
      console.error("Error fetching devices:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
  updateOne: async (req, res) => {
    try {
      const spaceId = req.params.id;
      const { status, name, location } = req.body;

      const space = Space.findOne({ _id: spaceId });

      if (!space) {
        return res
          .status(404)
          .json({ message: "Space not found or access denied." });
      }

      const updatedSpace = await Space.findByIdAndUpdate(
        spaceId,
        { name, status, location },
        { new: true }
      );

      res.status(200).json({ space: updatedSpace });
    } catch (error) {
      console.error("Error fetching spaces:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  createDeviceAndAddToSpace: async (req, res) => {
    try {
      const { spaceId } = req.params;
      const { name, type, status, userId } = req.body;
      console.log(req.body);

      // Validate space exists
      const existingSpace = await Space.findById(spaceId);
      if (!existingSpace) {
        return res.status(404).json({ message: "Space not found" });
      }

      // Create device (but not saved yet)
      const device = new Device({
        name,
        type,
        status,
        owner: userId,
        space: existingSpace._id,
      });

      await device.save();

      // Add to space's embedded devices array
      existingSpace.devices.push(device);

      // Save only space (since device is embedded here)
      await existingSpace.save();

      res.status(201).json({
        message: "Device created and added to space",
        device,
      });
    } catch (error) {
      console.error("Error creating device:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  delete: async (req, res) => {
    try {
      const { spaceId } = req.params;

      console.log(spaceId);

      const deletedSpace = await Space.findByIdAndDelete({ _id: spaceId });

      if (!deletedSpace) {
        return res
          .status(404)
          .json({ message: "Space not found or access denied." });
      }

      for (const device of deletedSpace.devices) {
        await Device.findByIdAndDelete({ _id: device._id });
      }

      res.status(200).json({ space: deletedSpace });
    } catch (error) {
      console.error("Error deleting space:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

export default spaceController;
