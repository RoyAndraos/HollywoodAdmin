require("dotenv").config();
const jwt = require("jsonwebtoken");

const { MongoClient } = require("mongodb");
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const WHITE_LIST = process.env.WHITE_LIST;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Failed to authenticate token" });
    }

    req.userId = decoded.userId;
    next();
  });
};

const signUp = async (req, res) => {
  const { userInfo } = req.body;
  console.log(userInfo);
  res.status(200).json({ status: 200, data: userInfo, message: "success!" });
};

module.exports = { signUp, verifyToken };
