const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const data = [
  {
    given_name: "Roy",
    family_name: "andraos",
    nickname: "Roy_andraos",
    name: "Roy andraos",
    picture:
      "https://lh3.googleusercontent.com/a/AGNmyxZ42A67uSF3cQwZmkh3Ja5Nnjxonx7Q5HL2FYI9=s96-c",
    locale: "en",
    updated_at: "2023-05-23T23:28:46.291Z",
    email: "Roy_andraos@live.fr",
    email_verified: true,
    sub: "google-oauth2|105225886944241955254",
  },
  // Add more documents here if needed
];

const batchImport = async (data) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");

    const result = await db.collection("admin").insertMany(data);

    if (result.acknowledged) {
      console.log("Success");
    } else {
      console.log("Failed");
    }
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
};

batchImport(data);
