require("dotenv").config();

const { v4: uuid } = require("uuid");
// const { initialAvailability } = require("./helpers");
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
//TOKEN STUFF
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
const jwt = require("jsonwebtoken");
const JWT_TOKEN_KEY = process.env.JWT_TOKEN_KEY;
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  const client = new MongoClient(MONGO_URI_RALF, options);
  try {
    client.connect();
    const db = client.db("HollywoodBarberShop");
    const isRevoked = await db.collection("revoked").findOne({ token: token });
    if (isRevoked) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error verifying token:", err);
  }
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }
  jwt.verify(token, JWT_TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    // Token is valid; user identification is available in decoded.userId
    req.userId = decoded.userId;
    next();
  });
};
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
//MONGO STUFF
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
const { MongoClient } = require("mongodb");
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const MONGO_URI_RALF = process.env.MONGO_URI_RALF;
const WHITE_LIST = process.env.WHITE_LIST;
// Initialize the MongoDB client
const client = new MongoClient(MONGO_URI_RALF, options);
// Create an HTTP server with your Express app

// Connect to the MongoDB server
client.connect().then(() => {
  // Start the Change Stream
  startChangeStream();
});

// Define a function to start the Change Stream
const startChangeStream = (io) => {
  const db = client.db("HollywoodBarberShop");
  const reservationsCollection = db.collection("reservations");

  // Create a Change Stream on the reservations collection
  const changeStream = reservationsCollection.watch();

  changeStream.on("change", (change) => {
    if (io) {
      io.emit("reservationChange", change);
    }
  });

  // Handle errors
  changeStream.on("error", (error) => {
    console.error("Change Stream error:", error);
  });
};
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

//BREVO STUFF
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
const brevo = require("@getbrevo/brevo");
const { htmlContent } = require("./templates/Welcome");
let defaultClient = brevo.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.EMAIL_API_KEY;
const sendEmail = async (
  email,
  fname,
  userFName,
  userLName,
  date,
  time,
  service,
  price
) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  let apiInstance = new brevo.TransactionalEmailsApi();
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.subject = "Your reservation at Hollywood Barbershop";
  sendSmtpEmail.htmlContent = htmlContent(
    userFName,
    formattedDate,
    time,
    service,
    price
  );
  sendSmtpEmail.sender = {
    name: fname,
    email: "roy_andraos@live.fr",
  };
  sendSmtpEmail.to = [{ email: email, name: `${userFName + " " + userLName}` }];
  await apiInstance.sendTransacEmail(sendSmtpEmail);
};
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

//GET REQUESTS
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
const getClients = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF, options);
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const clients = await db.collection("Clients").find().toArray();
    res.status(200).json({ status: 200, data: clients });
  } catch (err) {
    console.error("Error getting clients:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const getSearchResults = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF, options);
  const searchTerm = req.params.searchTerm;
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    if (searchTerm === "all") {
      const clients = await db.collection("Clients").find().toArray();
      res.status(200).json({ status: 200, data: clients });
      return;
    } else {
      const searchResults = await db
        .collection("Clients")
        .find({
          $or: [
            { fname: { $regex: searchTerm, $options: "i" } },
            { lname: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
            { number: { $regex: searchTerm, $options: "i" } },
            { note: { $regex: searchTerm, $options: "i" } },
            { reservations: { $regex: searchTerm, $options: "i" } },
          ],
        })
        .toArray();
      res.status(200).json({ status: 200, data: searchResults });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const getUserInfo = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF, options);
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const userInfo = await db.collection("admin").find().toArray();
    const reservations = await db.collection("reservations").find().toArray();
    const services = await db.collection("services").find().toArray();
    const images = await db.collection("Images").find().toArray();
    const text = await db.collection("web_text").find().toArray();
    res.status(200).json({
      status: 200,
      userInfo: userInfo,
      reservations: reservations,
      services: services,
      images: images,
      text: text,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

//POST REQUESTS
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const correctUsername =
      process.env.LOGIN_USERNAME.toLowerCase() === username.toLowerCase();
    const correctPassword = process.env.LOGIN_PASSWORD === password;
    if (correctPassword && correctUsername) {
      const token = jwt.sign({ userId: "admin" }, JWT_TOKEN_KEY, {
        expiresIn: "13h",
      });
      res.status(200).json({ status: 200, token: token });
    } else {
      res
        .status(401)
        .json({ status: 401, message: "Invalid username or password" });
    }
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const logout = async (req, res) => {
  const body = req.body;
  const client = new MongoClient(MONGO_URI_RALF, options);
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    await db.collection("revoked").insertOne(body);
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const addReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF, options);
  const { reservation } = req.body;
  const _id = uuid();
  const client_id = uuid();
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");

    reservation._id = _id;

    //add reservation to db
    await db.collection("reservations").insertOne(reservation);

    //send email to client
    if (reservation.clientEmail !== "") {
      await sendEmail(
        reservation.clientEmail,
        reservation.barber,
        reservation.clientName.split(" ")[0],
        reservation.clientName.split(" ")[1],
        reservation.date,
        reservation.slot[0].split("-")[1],
        reservation.service.name,
        reservation.service.price
      );
    }

    //check if client exists
    const isClient = await db
      .collection("Clients")
      .findOne({ email: reservation.clientEmail });

    //if client does not exist, create client
    if (!isClient) {
      await db.collection("Clients").insertOne({
        _id: client_id,
        email: reservation.clientEmail,
        fname: reservation.clientName.split(" ")[0],
        lname: reservation.clientName.split(" ")[1],
        number: reservation.clientNumber,
        note: "",
        reservations: [reservation._id],
      });

      //if client exists, add reservation to client
    } else {
      await db
        .collection("Clients")
        .updateOne({ _id: isClient._id }, { $push: { reservations: _id } });
    }
    res.status(200).json({ status: 200, message: "success", data: _id });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const addTimeOff = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF, options);
  const { startDate, endDate, _id } = req.body;
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    await db.collection("admin").updateOne(
      {
        _id: _id,
      },
      {
        $push: {
          time_off: {
            startDate: startDate,
            endDate: endDate,
          },
        },
      }
    );
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const uploadImage = async (req, res) => {
  const _id = uuid();
  const client = new MongoClient(MONGO_URI_RALF, options);
  const fileSrc = req.body.src;
  const filename = req.body.filename;
  const imageInfo = {
    _id: _id,
    filename: filename,
    src: fileSrc,
  };
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    if (filename === "slideShow") {
      await db.collection("Images").insertOne(imageInfo);
      res.status(202).json({ status: 200, imageInfo: imageInfo });
    } else if (filename === "about") {
      await db.collection("Images").updateOne(
        {
          filename: "about",
        },
        {
          $set: {
            src: fileSrc,
          },
        }
      );
      res.status(202).json({ status: 200, imageInfo: imageInfo });
    } else if (filename === "menu") {
      await db.collection("Images").updateOne(
        {
          filename: "menu",
        },
        {
          $set: {
            src: fileSrc,
          },
        }
      );
      res.status(202).json({ status: 200, imageInfo: imageInfo });
    } else {
      await db.collection("admin").updateOne(
        {
          _id: filename,
        },
        {
          $set: {
            picture: fileSrc,
          },
        }
      );
      res.status(202).json({ status: 200, imageInfo: imageInfo });
    }
  } catch (err) {
    console.error("Error updating image:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const addBarber = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF, options);
  const barberInfo = req.body.barberInfo;
  const _id = uuid();
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const newBarber = {
      _id: _id,
      given_name: barberInfo.given_name,
      family_name: barberInfo.family_name,
      email: barberInfo.email,
      picture: "",
      description: barberInfo.description,
      time_off: [],
      availability: barberInfo.availability,
    };
    await db.collection("admin").insertOne({
      _id: _id,
      given_name: barberInfo.given_name,
      family_name: barberInfo.family_name,
      email: barberInfo.email,
      picture: "",
      description: barberInfo.description,
      time_off: [],
      availability: barberInfo.availability,
    });
    res.status(200).json({ status: 200, message: "success", data: newBarber });
  } catch (err) {
    console.error("Error adding barber:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

//DELETE REQUESTS
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
const deleteBarberProfile = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF, options);
  const { barberId } = req.body;
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    await db.collection("admin").deleteOne({ _id: barberId });
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.error("Error deleting barber profile:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const deleteImage = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF, options);
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const query = { _id: req.params._id };
    await db.collection("Images").deleteOne(query);
    res.status(200).json({ status: 200, data: "success" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const deleteTimeOff = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF, options);
  const { _id, startDate, endDate } = req.body;
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const query = {
      _id: _id,
    };
    const newValues = {
      $pull: {
        time_off: {
          startDate: startDate,
          endDate: endDate,
        },
      },
    };
    await db.collection("admin").updateOne(query, newValues);
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const deleteReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF, options);
  const _id = req.params._id;
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    await db.collection("reservations").deleteOne({ _id: _id });
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

//PATCH REQUESTS
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

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

const updateAvailability = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF, options);
  const { _id, availability } = req.body;
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const query = { _id: _id };
    const newValues = { $set: { availability: availability } };
    const result = await db.collection("admin").updateOne(query, newValues);
    res.status(200).json({ status: 200, data: result });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const updateReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF, options);
  const reservation = req.body;
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const query = { _id: reservation._id };
    const newValues = {
      $set: {
        _id: reservation._id,
        name: reservation.name,
        email: reservation.email,
        number: reservation.number,
        barber: reservation.barber,
        service: reservation.service,
        date: reservation.date,
        slot: reservation.slot,
      },
    };
    await db.collection("reservations").updateOne(query, newValues);
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const updateBarberProfile = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF, options);
  const { barberId, barberInfo } = req.body;
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const query = { _id: barberId };
    const newValues = {
      $set: {
        given_name: barberInfo.given_name,
        family_name: barberInfo.family_name,
        email: barberInfo.email,
        description: barberInfo.description,
        picture: barberInfo.picture,
      },
    };
    await db.collection("admin").updateOne(query, newValues);
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.error("Error updating barber profile:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const updateText = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF, options);
  const { textId, text } = req.body;
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    await db
      .collection("web_text")
      .updateOne({ _id: textId }, { $set: { content: text } });
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.error("Error updating text:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const updateClient = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF, options);
  const _id = req.body[1];
  const field = Object.keys(req.body[0])[0];
  const value = Object.values(req.body[0])[0];
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const query = { _id: _id };
    const newValues = { $set: { [field]: value } };
    await db.collection("Clients").updateOne(query, newValues);
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.error("Error updating client:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

module.exports = {
  adminCheck,
  getUserInfo,
  updateAvailability,
  addReservation,
  addTimeOff,
  uploadImage,
  deleteImage,
  deleteTimeOff,
  updateReservation,
  deleteReservation,
  deleteBarberProfile,
  updateBarberProfile,
  addBarber,
  updateText,
  getSearchResults,
  getClients,
  updateClient,
  startChangeStream,
  login,
  logout,
  verifyToken,
};
