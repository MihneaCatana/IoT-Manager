import bcrypt from "bcrypt";
import User from "../model/userModel.js";
import { faker } from "@faker-js/faker";
import Space from "../model/spaceModel.js";
import mongoose from "mongoose";
import { Device } from "../model/deviceModel.js";

const otherController = {
  generateMockData: async (req, res) => {
    try {
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash("password", saltRounds);

      const createdUser = new User({
        username: faker.internet.username(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        location: faker.location.streetAddress(),
        city: faker.location.city(),
        country: faker.location.country(),
        zip: faker.location.zipCode(),
        subscription: "Premium",
        email: faker.internet.email(),
        password: hashedPassword,
      });

      await createdUser.save();

      const NUMBER_SPACES = 3;

      for (let space = 0; space < NUMBER_SPACES; space++) {
        const types = ["smart-home", "factory", "warehouse"];
        const statuses = ["inactive", "active", "maintenance"];

        const NUMBER_DEVICES = 5;

        const createSpace = new Space({
          name: types[space],
          location: faker.location.city + " " + faker.location.streetAddress(),
          type: types[space],
          status: statuses[space],
          owner: createdUser._id,
          devices: [],
        });

        const arrayDevices = [];

        for (let device = 0; device < NUMBER_DEVICES; device++) {
          const types = [
            "Smart Thermostat",
            "Security Camera",
            "Smart Lock",
            "Motion Sensor",
            "Smart Lights",
            "Smoke Detector",
            "Smart Speaker",
            "Door Sensor",
            "Window Sensor",
            "Smart Switch",
          ];

          const createDevice = new Device({
            name: "Device " + types[device],
            type: types[device],
            status: "online",
            owner: createdUser._id,
            powerConsumption: 0,
            space: createSpace._id,
          });

          arrayDevices.push(createDevice);

          await createDevice.save();
        }

        createSpace.devices = arrayDevices;

        await createSpace.save();
      }

      return res.status(200).send({ message: "Data generated succesfully" });
    } catch (error) {
      console.error("Error generating data:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  resetDb: async (req, res) => {
    try {
      const collections = Object.keys(mongoose.connection.collections);

      for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany(); // Or use drop() to remove entire collection
      }

      return res.status(200).json({ message: "Database reset successfully." });
    } catch (error) {
      console.error("Error generating data:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

export default otherController;
