import { Kafka } from "kafkajs";

const kafkaConfig = new Kafka({
  clientId: "nodejs-kafka",
  brokers: ["localhost:9092"],
  retry: {
    retries: 5, // Number of retries before failing
    initialRetryTime: 300, // Retry delay in ms
    maxRetryTime: 10000, // Maximum retry delay in ms
  },
  connectionTimeout: 10000, // Connection timeout in ms
});

const producer = kafkaConfig.producer();

const consumer = kafkaConfig.consumer({
  groupId: "test-group",
});

const produceMessage = async (topic, messages) => {
  try {
    await producer.connect();
    await producer.send({
      topic: topic,
      messages: messages,
    });
  } catch (err) {
    console.log(err);
  } finally {
    await producer.disconnect();
  }
};

const consumeMessage = async (topic, callback) => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: topic, fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();
        callback(value);
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const kafka = {
  kafkaConfig,
  producer,
  consumer,
  produceMessage,
  consumeMessage,
};

export default kafka;
