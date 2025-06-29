import bcrypt from "bcrypt";
import User from "../model/userModel.js";
import { faker } from "@faker-js/faker";
import Space from "../model/spaceModel.js";
import mongoose from "mongoose";
import { Device } from "../model/deviceModel.js";
import { v4 as uuidv4 } from "uuid";
import kafka from "../config/config.js";

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
        location: faker.location.street(),
        city: faker.location.city(),
        country: faker.location.country(),
        zip: faker.location.zipCode(),
        subscription: "Premium",
        email: faker.internet.email({ provider: "gmail.com" }),
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
          location:
            faker.location.city() + " " + faker.location.streetAddress(),
          type: types[space],
          status: statuses[space],
          owner: createdUser._id,
          devices: [],
        });

        const arrayDevices = [];

        for (let device = 0; device < NUMBER_DEVICES; device++) {
          const types = [
            "Humidity Sensor",
            "Temperature Sensor",
            "Smoke Detector",
            "Security Camera",
            "Smart Lights",
          ];

          const getRandomInt = Math.floor(Math.random() * 2);
          const getRandomIntDType = Math.floor(Math.random() * 5);

          const statuses = ["online", "offline"];

          const createDevice = new Device({
            name: "Device " + types[device],
            type: types[getRandomIntDType],
            status: statuses[getRandomInt],
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
  generateMessages: async (req, res) => {
    try {
      const id = uuidv4();
      const { userId } = req.body;

      const devices = await Device.find().sort({
        createdAt: -1,
      });

      setInterval(() => {
        const messages = [];
        for (const device of devices) {
          let eventMessage;

          if (device.type === "Humidity Sensor") {
            eventMessage = {
              humidity: parseFloat((Math.random() * 100).toFixed(1)),
              powerConsumption: parseFloat(
                (Math.random() * (0.002 - 0.001) + 0.001).toFixed(6)
              ),
            };
          } else if (device.type === "Temperature Sensor") {
            eventMessage = {
              temperature: parseFloat(
                (Math.random() * (50 - -10) + -10).toFixed(1)
              ),
              powerConsumption: parseFloat(
                (Math.random() * (0.002 - 0.001) + 0.001).toFixed(6)
              ),
            };
          } else if (device.type === "Security Camera") {
            eventMessage = {
              powerConsumption: parseFloat(
                (Math.random() * (0.002 - 0.001) + 0.001).toFixed(6)
              ),
              battery: parseFloat((Math.random() * 100).toFixed(1)),
            };
          } else {
            eventMessage = {
              powerConsumption: parseFloat(
                (Math.random() * (0.002 - 0.001) + 0.001).toFixed(6)
              ),
            };
          }

          const message = {
            key: id,
            value: JSON.stringify({
              timestamp: new Date(),
              user: userId,
              deviceId: device._id,
              events: eventMessage,
            }),
          };

          messages.push(message);
        }

        kafka.produceMessage(process.env.TOPIC_NAME, messages);
      }, 5000);

      console.warn("START PRODUCING MESSAGES");
    } catch (error) {
      console.error("Error generating messages:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

export default otherController;
