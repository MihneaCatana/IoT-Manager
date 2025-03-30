import kafka from "../config/config.js";
import { v4 as uuidv4 } from "uuid";

const sendMessageToKafka = async (req, res) => {
  try {
    const { message } = req.body;
    const id = uuidv4();
    const messages = [
      {
        key: id,
        value: JSON.stringify({
          expirationDate: new Date(),
          message: message,
          user: "test",
        }),
        timestamp: new Date(),
      },
    ];

    kafka.produceMessage(process.env.TOPIC_NAME, messages);

    res.status(200).json({
      status: "Ok!",
      message: "Message successfully send!",
    });
  } catch (err) {
    console.log(err);
  }
};

const controllers = { sendMessageToKafka };

export default controllers;
