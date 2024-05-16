require("dotenv").config();
const { dailyAvailability } = require("./batchImport");
const { v4: uuid } = require("uuid");
// const { initialAvailability } = require("./helpers");
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
//MONGO STUFF
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
const { connectToMongo } = require("./mongodb");
// Define a function to start the Change Stream
const startChangeStream = async (io) => {
  const client = await connectToMongo();
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
//TOKEN STUFF
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
const jwt = require("jsonwebtoken");
const JWT_TOKEN_KEY = process.env.JWT_TOKEN_KEY;
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const client = await connectToMongo();
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const isRevoked = await db.collection("revoked").findOne({ token: token });
    if (isRevoked) {
      await client.close();
      return res.status(401).json({ message: "Invalid credentials" });
    }
    await client.close(); // Close connection after checking token
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
//TWILIO STUFF
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
const accountSid = process.env.SMS_SSID;
const authToken = process.env.SMS_AUTH_TOKEN;
const twilioClient = require("twilio")(accountSid, authToken);
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

//GET REQUESTS
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

const getClientByName = async (req, res) => {
  const name = req.params.name.toLowerCase();
  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    const query = { fname: { $regex: name.toLowerCase(), $options: "i" } };
    const clients = await db.collection("Clients").find(query).toArray();
    res.set("Content-Type", "application/json");
    res.status(200).json({ status: 200, data: clients });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getClients = async (req, res) => {
  const page = parseInt(req.query.page); // Current page number, default to 1
  const limit = parseInt(req.query.limit); // Number of items per page, default to 10
  const skip = (page - 1) * limit; // Calculate skip value
  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    const clients = await db
      .collection("Clients")
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await db.collection("Clients").countDocuments();
    const numberOfPages = Math.ceil(total / limit);
    res;
    res
      .status(200)
      .json({ status: 200, data: clients, numberOfPages: numberOfPages });
  } catch (err) {
    console.error("Error getting clients:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getClientNotes = async (req, res) => {
  const _id = req.params.client_id;
  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    const clientData = await db.collection("Clients").findOne({ _id: _id });
    res.status(200).json({ status: 200, data: clientData.note });
  } catch (err) {
    console.error("Error getting client notes:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getSearchResults = async (req, res) => {
  const searchTerm = req.params.searchTerm;
  const page = parseInt(req.query.page); // Current page number, default to 1
  const limit = parseInt(req.query.limit); // Number of items per page, default to 10
  const skip = (page - 1) * limit; // Calculate skip value

  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    let query = {};

    // If searchTerm is provided and not 'all', construct search query
    if (searchTerm && searchTerm !== "all") {
      query = {
        $or: [
          { fname: { $regex: searchTerm, $options: "i" } },
          { lname: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
          { number: { $regex: searchTerm, $options: "i" } },
          { note: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    // Fetch clients based on query and pagination parameters
    const clients = await db
      .collection("Clients")
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await db.collection("Clients").countDocuments(query);
    const numberOfPages = Math.ceil(total / limit);
    res
      .status(200)
      .json({ status: 200, data: clients, numberOfPages: numberOfPages });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    const userInfo = await db.collection("admin").find().toArray();
    const reservations = await db.collection("reservations").find().toArray();
    const services = await db.collection("services").find().toArray();
    const images = await db.collection("Images").find().toArray();
    const text = await db.collection("web_text").find().toArray();
    const employeeServices = await db
      .collection("servicesEmp")
      .find()
      .toArray();
    res.status(200).json({
      status: 200,
      userInfo: userInfo,
      reservations: reservations,
      services: services,
      images: images,
      text: text,
      employeeServices: employeeServices,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
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
    const correctEmployeeUsername =
      process.env.EMPLOYEE_USERNAME.toLowerCase() === username.toLowerCase();
    const correctEmployeePassword = process.env.EMPLOYEE_PASSWORD === password;
    if (correctPassword && correctUsername) {
      const token = jwt.sign({ userId: "admin" }, JWT_TOKEN_KEY, {
        expiresIn: "13h",
      });
      res.status(200).json({ status: 200, token: token, role: "admin" });
    } else if (correctEmployeeUsername && correctEmployeePassword) {
      const token = jwt.sign({ userId: "employee" }, JWT_TOKEN_KEY, {
        expiresIn: "13h",
      });
      res.status(200).json({ status: 200, token: token, role: "employee" });
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

  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    await db.collection("revoked").insertOne(body);
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const addReservation = async (req, res) => {
  const reservation = req.body.reservation;
  const _id = uuid();
  const client_id = uuid();
  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");

    //check if client exists
    const isClient = await db
      .collection("Clients")
      .findOne({ number: reservation.number });

    //if client does not exist, create client
    if (!isClient) {
      await db.collection("Clients").insertOne({
        _id: client_id,
        email: reservation.email.toLowerCase(),
        fname: reservation.fname.toLowerCase(),
        lname: reservation.lname.toLowerCase(),
        number: reservation.number,
        note: "",
        reservations: [_id],
      });

      const reservationToSend = {
        _id: _id,
        client_id: client_id,
        fname: reservation.fname.toLowerCase(),
        lname: reservation.lname.toLowerCase(),
        email: reservation.email.toLowerCase(),
        number: reservation.number,
        barber: reservation.barber,
        service: reservation.service,
        date: reservation.date,
        slot: reservation.slot,
      };

      //add reservation to db
      await db.collection("reservations").insertOne(reservationToSend);
      if (reservation.sendSms === true) {
        // send message to client
        await twilioClient.messages.create({
          body: `Bonjour ${reservation.fname} ${
            reservation.lname !== "" && reservation.lname
          }, votre réservation au Hollywood Barbershop est confirmée pour ${
            reservation.date
          } à ${reservation.slot[0].split("-")[1]}. Vous recevrez une ${
            reservation.service.name
          } pour ${reservation.service.price} CAD. ~${reservation.barber}

Hello ${reservation.fname} ${
            reservation.lname !== "" && reservation.lname
          }, your reservation at Hollywood Barbershop is confirmed for ${
            reservation.date
          } at ${reservation.slot[0].split("-")[1]}. You will be getting a ${
            reservation.service.name
          } for ${reservation.service.price} CAD. ~${reservation.barber}

ID: ${_id}
`,
          messagingServiceSid: "MG92cdedd67c5d2f87d2d5d1ae14085b4b",
          to: reservation.number,
        });
      }

      res.status(200).json({
        status: 200,
        message: "success",
        res_id: _id,
        client_id: client_id,
      });
    } else {
      //if client exists, add reservation to client
      await db
        .collection("Clients")
        .updateOne({ _id: isClient._id }, { $push: { reservations: _id } });
      const reservationToSend = {
        _id: _id,
        client_id: isClient._id,
        fname: reservation.fname.toLowerCase(),
        lname: reservation.lname.toLowerCase(),
        email: reservation.email.toLowerCase(),
        number: reservation.number,
        barber: reservation.barber,
        service: reservation.service,
        date: reservation.date,
        slot: reservation.slot,
      };

      //add reservation to db
      await db.collection("reservations").insertOne(reservationToSend);
      if (reservation.sendSms === true) {
        // send message to client
        await twilioClient.messages.create({
          body: `Bonjour ${reservation.fname} ${
            reservation.lname !== "" && reservation.lname
          }, votre réservation au Hollywood Barbershop est confirmée pour ${
            reservation.date
          } à ${reservation.slot[0].split("-")[1]}. Vous recevrez une ${
            reservation.service.name
          } pour ${reservation.service.price} CAD. ~${reservation.barber}
  
  Hello ${reservation.fname} ${
            reservation.lname !== "" && reservation.lname
          }, your reservation at Hollywood Barbershop is confirmed for ${
            reservation.date
          } at ${reservation.slot[0].split("-")[1]}. You will be getting a ${
            reservation.service.name
          } for ${reservation.service.price} CAD. ~${reservation.barber}

  ID: ${_id}
  `,
          messagingServiceSid: "MG92cdedd67c5d2f87d2d5d1ae14085b4b",
          to: reservation.number,
        });
      }

      res.status(200).json({
        status: 200,
        message: "success",
        res_id: _id,
        client_id: isClient._id,
      });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const addTimeOff = async (req, res) => {
  const { startDate, endDate, _id } = req.body;
  try {
    const client = await connectToMongo();
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
  }
};

const uploadImage = async (req, res) => {
  const _id = uuid();

  const fileSrc = req.body.src;
  const filename = req.body.filename;
  const imageInfo = {
    _id: _id,
    filename: filename,
    src: fileSrc,
  };
  try {
    const client = await connectToMongo();
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
    } else if (filename === "menuBackground") {
      await db.collection("Images").updateOne(
        {
          filename: "menuBackground",
        },
        {
          $set: {
            src: fileSrc,
          },
        }
      );
      res.status(202).json({ status: 200, imageInfo: imageInfo });
    } else if (filename === "aboutBackground") {
      await db.collection("Images").updateOne(
        {
          filename: "aboutBackground",
        },
        {
          $set: {
            src: fileSrc,
          },
        }
      );
      res.status(202).json({ status: 200, imageInfo: imageInfo });
    } else if (filename === "barbersBackground") {
      await db.collection("Images").updateOne(
        {
          filename: "barbersBackground",
        },
        {
          $set: {
            src: fileSrc,
          },
        }
      );
      res.status(202).json({ status: 200, imageInfo: imageInfo });
    } else if (filename === "homepageBackground") {
      await db.collection("Images").updateOne(
        {
          filename: "homepageBackground",
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
  }
};

const addBarber = async (req, res) => {
  const barberInfo = req.body.barberInfo;
  const _id = uuid();
  try {
    const client = await connectToMongo();
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
      dailyAvailability: dailyAvailability,
    };
    await db.collection("admin").insertOne(newBarber);
    res.status(200).json({ status: 200, message: "success", data: newBarber });
  } catch (err) {
    console.error("Error adding barber:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

//DELETE REQUESTS
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
const deleteService = async (req, res) => {
  const { _id } = req.params;

  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    await db.collection("services").deleteOne({ _id: _id });
    res.status(200).json({ status: 200, _id: _id });
  } catch {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteBarberProfile = async (req, res) => {
  const { barberId } = req.body;
  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    await db.collection("admin").deleteOne({ _id: barberId });
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.error("Error deleting barber profile:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    const query = { _id: req.params._id };
    await db.collection("Images").deleteOne(query);
    res.status(200).json({ status: 200, data: "success" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteTimeOff = async (req, res) => {
  const { _id, startDate, endDate } = req.body;
  try {
    const client = await connectToMongo();
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
  }
};

const deleteReservation = async (req, res) => {
  const _id = req.body.res_id;
  const client_id = req.body.client_id;
  const clientNumber = req.body.clientNumber;
  const sendSMS = req.body.sendSMS;
  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    await db.collection("reservations").deleteOne({ _id: _id });
    await db
      .collection("Clients")
      .updateOne({ _id: client_id }, { $pull: { reservations: _id } });
    if (sendSMS === true) {
      // send message to client
      await twilioClient.messages.create({
        body: `Bonjour, votre réservation a été annulée. ~Hollywood Barbershop
        
        Hello, your reservation has been cancelled. ~Hollywood Barbershop
        `,
        messagingServiceSid: "MG92cdedd67c5d2f87d2d5d1ae14085b4b",
        to: clientNumber,
      });
    }

    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteClient = async (req, res) => {
  const _id = req.params._id;
  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    await db.collection("Clients").deleteOne({ _id: _id });
    res.status(200).json({ status: 200, _id: _id });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

//PATCH REQUESTS
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

const updateAvailability = async (req, res) => {
  const { _id, availability } = req.body;
  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    const query = { _id: _id };
    const newValues = { $set: { availability: availability } };
    const result = await db.collection("admin").updateOne(query, newValues);
    res.status(200).json({ status: 200, data: result });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const updateDailyAvailability = async (req, res) => {
  const { _id, dailyAvailability } = req.body;
  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    const query = { _id: _id };
    const newValues = { $set: { dailyAvailability: dailyAvailability } };
    await db.collection("admin").updateOne(query, newValues);
    res.status(200).json({ status: 200, data: dailyAvailability });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const updateReservation = async (req, res) => {
  const reservation = req.body;
  try {
    const client = await connectToMongo();
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
  }
};

const updateBarberProfile = async (req, res) => {
  const { barberId, barberInfo } = req.body;
  try {
    const client = await connectToMongo();
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
  }
};

const updateText = async (req, res) => {
  const { textId, content, french } = req.body;
  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    await db
      .collection("web_text")
      .updateOne(
        { _id: textId },
        { $set: { content: content, french: french } }
      );
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.error("Error updating text:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const updateClient = async (req, res) => {
  const _id = req.body[1];
  const field = Object.keys(req.body[0])[0];
  const value = Object.values(req.body[0])[0];
  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    const query = { _id: _id };
    const newValues = { $set: { [field]: value } };
    await db.collection("Clients").updateOne(query, newValues);
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.error("Error updating client:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const updateServices = async (req, res) => {
  const serviceEdit = req.body[1];
  const role = req.body[0];
  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    if (role === "admin") {
      await db
        .collection("services")
        .updateOne({ _id: serviceEdit._id }, { $set: serviceEdit });
    } else {
      await db
        .collection("servicesEmp")
        .updateOne({ _id: serviceEdit._id }, { $set: serviceEdit });
    }

    res
      .status(200)
      .json({ status: 200, data: serviceEdit, message: "success" });
  } catch (err) {
    console.error("Error updating services:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const updateClientNote = async (req, res) => {
  const { client_id, note } = req.body;
  try {
    const client = await connectToMongo();
    const db = client.db("HollywoodBarberShop");
    await db
      .collection("Clients")
      .updateOne({ _id: client_id }, { $set: { note: note } });
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.error("Error updating client note:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

module.exports = {
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
  updateServices,
  getClientNotes,
  updateClientNote,
  getClientByName,
  deleteClient,
  deleteService,
  updateDailyAvailability,
};

// availability: PATCH REQUEST
// Client Res: Note to add
// when res delete, remove from client
