const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI_RALF;
const client = new MongoClient(MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: false,
});

let db;

async function connectMongo() {
  if (!db) {
    await client.connect(); // ✅ connect once
    db = client.db("HollywoodBarberShop");
    console.log("MongoDB connected");
  }
  return db;
}

module.exports = { client, connectMongo };
