// In your mongodb.js file

const { MongoClient } = require("mongodb");

const MONGO_URI_RALF = process.env.MONGO_URI_RALF;
let client;

const connectToMongo = async () => {
  if (!client) {
    client = new MongoClient(MONGO_URI_RALF);
    await client.connect();
  }
  return client;
};

module.exports = {
  connectToMongo,
};
