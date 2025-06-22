import Space from "../model/spaceModel.js";

const spaceController = {
  create: async (req, res) => {
    try {
      const { name, userId } = req.body;

      // Validate required fields
      if (!name) {
        return res.status(400).json({ message: "Name is required." });
      }

      const newSpace = new Space({
        name,
        owner: userId,
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
};

export default spaceController;
