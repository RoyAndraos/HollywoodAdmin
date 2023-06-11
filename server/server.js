require("dotenv").config();

const { MongoClient, ObjectId } = require("mongodb");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const MONGO_URI = process.env.MONGO_URI;
const WHITE_LIST = process.env.WHITE_LIST;

const adminCheck = async (req, res) => {
  const userInfo = req.body;
  if (WHITE_LIST.includes(userInfo.email.toLowerCase())) {
    res.status(200).json({
      status: 200,
      data: userInfo,
      message: `Welcome Back ${userInfo.given_name}!`,
    });
  } else {
    res.status(404).json({
      status: 404,
      message: "you are not allowed access",
    });
  }
};

const getUserInfo = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const userInfo = await db.collection("admin").find().toArray();
    res.status(200).json({ status: 200, data: userInfo });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const updateAvailability = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { _id, availability } = req.body;
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const query = { _id: new ObjectId(`${_id}`) };
    const newValues = { $set: { availability: availability } };
    const result = await db.collection("admin").updateOne(query, newValues);
    res.status(200).json({ status: 200, data: result });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

module.exports = { adminCheck, getUserInfo, updateAvailability };
