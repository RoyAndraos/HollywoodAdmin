require("dotenv").config();

const { MongoClient } = require("mongodb");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const JWT_SECRET = process.env.JWT_SECRET
const WHITE_LIST = process.env.WHITE_LIST;


const adminCheck = async (req, res) => {
  const  userInfo  = req.body;
  if(WHITE_LIST.includes(userInfo.email.toLowerCase())){
    res.status(200).json({ status: 200, data: userInfo, message: `Welcome Back ${userInfo.given_name}!` });
  } else {
    res.status(404).json({
      status:404, message: "you are not allowed access"
    })
  }
};

module.exports = { adminCheck };
