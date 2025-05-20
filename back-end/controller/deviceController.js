import Device from "../model/deviceModel.js";

const deviceController = {
  create: async (req, res) => {
    try {
      const { name, type, userId } = req.body;

      // Validate required fields
      if (!name || !type) {
        return res.status(400).json({ message: "Name and type are required." });
      }

      const newDevice = new Device({
        name,
        type,
        owner: userId,
        metadata: {
          location: "Unknown",
          ipAddress: null,
          firmwareVersion: "v1.0.0",
        },
      });

      const savedDevice = await newDevice.save();
      res.status(201).json({
        message: "Device registered successfully",
        device: savedDevice,
      });
    } catch (error) {
      console.error("Error creating device:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  getAll: async (req, res) => {
    try {
      const userId = req.userId;

      const devices = await Device.find({ owner: userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({ devices });
    } catch (error) {
      console.error("Error fetching devices:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getOne: async (req, res) => {
    try {
      const deviceId = req.params.id;
      const userId = req.user.userId;

      const device = await Device.findOne({ _id: deviceId, owner: userId });

      if (!device) {
        return res
          .status(404)
          .json({ message: "Device not found or access denied." });
      }

      res.status(200).json({ device });
    } catch (error) {
      console.error("Error fetching devices:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

export default deviceController;
