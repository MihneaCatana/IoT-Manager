import kafka from "../config/config.js";

const sendMessageToKafka = async (req, res) => {
  try {
    const { message } = req.body;
    const messages = [{ key: "key1", value: message }];

    kafka.produceMessage("my-topic", messages);

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
