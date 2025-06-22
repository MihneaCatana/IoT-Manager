import Space from "../model/spaceModel.js";

const spaceController = {
  create: async (req, res) => {
    try {
      const { name,location, userId } = req.body;

      // Validate required fields
      if (!name) {
        return res.status(400).json({ message: "Name is required." });
      }

      const newSpace = new Space({
        name,
        location,
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
  getOne : async (req,res) =>{
    try {
      const spaceId = req.params.id;
      const userId = req.params.userId;

      const space = await Space.findOne({_id:spaceId, owner: userId});
      
      if (!space) {
        return res
          .status(404)
          .json({ message: "Space not found or access denied." });
      }

      res.status(200).json({ space });
    } catch (err) {
      console.error("Error fetching devices:", err);
      res.status(500).json({message:'Server error'})
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
        { name, status, location},
        { new: true }
      );

      res.status(200).json({ space: updatedSpace });
    } catch (error) {
      console.error("Error fetching spaces:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

export default spaceController;
