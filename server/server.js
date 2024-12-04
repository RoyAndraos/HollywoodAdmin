require("dotenv").config();
const { dailyAvailability } = require("./batchImport");
const { v4: uuid } = require("uuid");
// const { initialAvailability } = require("./helpers");
const { weekDays } = require("./helpers");
const moment = require("moment");
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
//MONGO STUFF
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
const { MongoClient } = require("mongodb");
const MONGO_URI_RALF = process.env.MONGO_URI_RALF;

const changeStreamClient = new MongoClient(MONGO_URI_RALF);
const sendData = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  startChangeStream(sendEvent);
  req.on("close", () => {
    res.end();
  });
};
let changeStream;
const closeClient = async () => {
  try {
    if (changeStream) {
      await changeStream.close();
    }
    await changeStreamClient.close();
  } catch (error) {
    console.error("Error closing change stream or client:", error);
  } finally {
    process.exit(0);
  }
};

// Start fresh with signal handling
process.removeAllListeners("SIGINT");
process.removeAllListeners("SIGTERM");

// Attach process listeners only once
process.once("SIGINT", closeClient);
process.once("SIGTERM", closeClient);

const startChangeStream = async (sendEvent) => {
  const db = changeStreamClient.db("HollywoodBarberShop");
  const reservationsCollection = db.collection("reservations");

  // Ensure the client is connected
  if (!changeStreamClient.isConnected()) {
    await changeStreamClient.connect();
  }

  try {
    // Start the change stream from the latest operation time
    const operationTime = await db
      .command({ isMaster: 1 })
      .then((res) => res.operationTime);

    // Use `startAtOperationTime` to avoid replaying old events
    changeStream = reservationsCollection.watch([], {
      startAtOperationTime: operationTime,
    });
  } catch (error) {
    console.error("Failed to start change stream with operation time:", error);

    // Fallback to just starting the stream from now, in case of an error
    changeStream = reservationsCollection.watch();
  }

  changeStream.on("change", (change) => {
    sendEvent(change);
  });

  // Handle errors with more detailed logging
  changeStream.on("error", (error) => {
    console.error("Change Stream error:", error.message, error.stack);
  });

  // Handle stream closure and clean up listeners
  changeStream.on("close", () => {
    console.log("Change stream closed.");
    changeStream.removeAllListeners();
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
    const client = new MongoClient(MONGO_URI_RALF);
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
  const client = new MongoClient(MONGO_URI_RALF);

  try {
    const db = client.db("HollywoodBarberShop");
    const query = { fname: { $regex: name.toLowerCase(), $options: "i" } };
    const clients = await db.collection("Clients").find(query).toArray();
    res.set("Content-Type", "application/json");
    res.status(200).json({ status: 200, data: clients });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

const getClients = async (req, res) => {
  const page = parseInt(req.query.page); // Current page number, default to 1
  const limit = parseInt(req.query.limit); // Number of items per page, default to 10
  const skip = (page - 1) * limit; // Calculate skip value
  const client = new MongoClient(MONGO_URI_RALF);

  try {
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
  } finally {
    await client.close();
  }
};

const getClientNotes = async (req, res) => {
  const _id = req.params.client_id;
  const client = new MongoClient(MONGO_URI_RALF);

  try {
    const db = client.db("HollywoodBarberShop");
    const clientData = await db.collection("Clients").findOne({ _id: _id });
    res.status(200).json({ status: 200, data: clientData.note });
  } catch (err) {
    console.error("Error getting client notes:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

const getSearchResults = async (req, res) => {
  const searchTerm = req.params.searchTerm;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const client = new MongoClient(MONGO_URI_RALF);

  try {
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
  } finally {
    await client.close();
  }
};

const getUserInfo = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF);
  try {
    const db = client.db("HollywoodBarberShop");
    const userInfo = await db.collection("admin").find().toArray();
    const reservations = await db.collection("reservations").find().toArray();
    const services = await db.collection("services").find().toArray();
    const images = await db.collection("Images").find().toArray();
    const text = await db.collection("web_text").find().toArray();
    const clients = await db.collection("Clients").find().toArray();
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
      clients: clients,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

//POST REQUESTS
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

const sendReminders = async (req, res) => {
  const { to, message } = req.body;
  try {
    await twilioClient.messages.create({
      body: message,
      messagingServiceSid: "MG92cdedd67c5d2f87d2d5d1ae14085b4b",
      to: to,
    });
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

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
  const client = new MongoClient(MONGO_URI_RALF);

  try {
    const db = client.db("HollywoodBarberShop");
    await db.collection("revoked").insertOne(body);
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

const addReservation = async (req, res) => {
  const reservation = req.body.reservation;
  const _id = uuid();
  const client = new MongoClient(MONGO_URI_RALF);
  const client_id = uuid();

  try {
    const db = client.db("HollywoodBarberShop");

    const isClient = await db
      .collection("Clients")
      .findOne({ number: reservation.number });
    // translate date string to french (from Thu Mar 28 2024 to Jeu Mar 28 2024)
    const weekDay = reservation.date.split(" ");
    const frenchWeekDay = weekDays.find((day) => day.day === weekDay);
    const frenchDate = reservation.date.replace(weekDay, frenchWeekDay);

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

      await db.collection("reservations").insertOne(reservationToSend);

      if (reservation.sendSMS) {
        try {
          await twilioClient.messages.create({
            body: `Bonjour ${reservation.fname} ${
              reservation.lname || ""
            }, votre réservation au Hollywood Barbershop est confirmée pour ${frenchDate} à ${
              reservation.slot[0].split("-")[1]
            }. Vous recevrez une ${reservation.service.name} pour ${
              reservation.service.price
            } CAD. ~${reservation.barber}

Hello ${reservation.fname} ${
              reservation.lname || ""
            }, your reservation at Hollywood Barbershop is confirmed for ${
              reservation.date
            } at ${reservation.slot[0].split("-")[1]}. You will be getting a ${
              reservation.service.english
            } for ${reservation.service.price} CAD. ~${reservation.barber}

ID: ${_id}`,
            messagingServiceSid: "MG92cdedd67c5d2f87d2d5d1ae14085b4b",
            to: reservation.number,
          });
        } catch (smsError) {
          console.error(`Error sending SMS: ${smsError.message}`);
          return res.status(500).json({
            status: 500,
            message: `Error sending SMS: ${smsError.message}`,
          });
        }
      }

      res.status(200).json({
        status: 200,
        message: "success",
        res_id: _id,
        client_id: client_id,
      });
    } else {
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

      await db.collection("reservations").insertOne(reservationToSend);

      if (reservation.sendSMS) {
        try {
          await twilioClient.messages.create({
            body: `Bonjour ${reservation.fname} ${
              reservation.lname || ""
            }, votre réservation au Hollywood Barbershop est confirmée pour ${frenchDate} à ${
              reservation.slot[0].split("-")[1]
            }. Vous recevrez une ${reservation.service.name} pour ${
              reservation.service.price
            } CAD. ~${reservation.barber}

Hello ${reservation.fname} ${
              reservation.lname || ""
            }, your reservation at Hollywood Barbershop is confirmed for ${
              reservation.date
            } at ${reservation.slot[0].split("-")[1]}. You will be getting a ${
              reservation.service.english
            } for ${reservation.service.price} CAD. ~${reservation.barber}

ID: ${_id}`,
            messagingServiceSid: "MG92cdedd67c5d2f87d2d5d1ae14085b4b",
            to: reservation.number,
          });
        } catch (smsError) {
          console.error(`Error sending SMS: ${smsError}`);
          return res.status(500).json({
            status: 500,
            message: `Error sending SMS: ${smsError}`,
          });
        }
      }

      res.status(200).json({
        status: 200,
        message: "success",
        res_id: _id,
        client_id: isClient._id,
      });
    }
  } catch (err) {
    console.error("Error adding reservation:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

const addTimeOff = async (req, res) => {
  const { startDate, endDate, _id } = req.body;
  const client = new MongoClient(MONGO_URI_RALF);

  try {
    // Ensure start and end dates are in UTC for the entire day
    const start = moment.utc(startDate).startOf("day").toISOString();
    const end = moment.utc(endDate).endOf("day").toISOString();

    const db = client.db("HollywoodBarberShop");
    await db.collection("admin").updateOne(
      {
        _id: _id,
      },
      {
        $push: {
          time_off: {
            startDate: start,
            endDate: end,
          },
        },
      }
    );

    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
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
  const client = new MongoClient(MONGO_URI_RALF);

  try {
    const db = client.db("HollywoodBarberShop");

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
  } catch (err) {
    console.error("Error updating image:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

const addBarber = async (req, res) => {
  const barberInfo = req.body.barberInfo;
  const _id = uuid();
  const client = new MongoClient(MONGO_URI_RALF);

  try {
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
  } finally {
    await client.close();
  }
};
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

//DELETE REQUESTS
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
const deleteService = async (req, res) => {
  const { _id } = req.params;
  const client = new MongoClient(MONGO_URI_RALF);

  try {
    const db = client.db("HollywoodBarberShop");
    await db.collection("services").deleteOne({ _id: _id });
    res.status(200).json({ status: 200, _id: _id });
  } catch {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

const deleteBarberProfile = async (req, res) => {
  const { barberId } = req.body;
  const client = new MongoClient(MONGO_URI_RALF);

  try {
    const db = client.db("HollywoodBarberShop");
    await db.collection("admin").deleteOne({ _id: barberId });
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.error("Error deleting barber profile:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

const deleteImage = async (req, res) => {
  const client = new MongoClient(MONGO_URI_RALF);

  try {
    const db = client.db("HollywoodBarberShop");
    const query = { _id: req.params._id };
    await db.collection("Images").deleteOne(query);
    res.status(200).json({ status: 200, data: "success" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

const deleteTimeOff = async (req, res) => {
  const { _id, startDate, endDate } = req.body;
  const client = new MongoClient(MONGO_URI_RALF);
  try {
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
    await client.close();
  }
};

const deleteReservation = async (req, res) => {
  const _id = req.body.res_id;
  const client_id = req.body.client_id;
  const clientNumber = req.body.clientNumber;
  const client = new MongoClient(MONGO_URI_RALF);

  const sendSMS = req.body.sendSMS;
  try {
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
  } finally {
    await client.close();
  }
};

const deleteClient = async (req, res) => {
  const _id = req.params._id;
  const client = new MongoClient(MONGO_URI_RALF);

  try {
    const db = client.db("HollywoodBarberShop");
    await db.collection("Clients").deleteOne({ _id: _id });
    res.status(200).json({ status: 200, _id: _id });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

//PATCH REQUESTS
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

const updateAvailability = async (req, res) => {
  const { _id, availability } = req.body;
  const client = new MongoClient(MONGO_URI_RALF);

  try {
    const db = client.db("HollywoodBarberShop");
    const query = { _id: _id };
    const newValues = { $set: { availability: availability } };
    const result = await db.collection("admin").updateOne(query, newValues);
    res.status(200).json({ status: 200, data: result });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

const updateDailyAvailability = async (req, res) => {
  const { _id, dailyAvailability } = req.body;
  const client = new MongoClient(MONGO_URI_RALF);

  try {
    const db = client.db("HollywoodBarberShop");
    const query = { _id: _id };
    const newValues = { $set: { dailyAvailability: dailyAvailability } };
    await db.collection("admin").updateOne(query, newValues);
    res.status(200).json({ status: 200, data: dailyAvailability });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

const updateReservation = async (req, res) => {
  const reservation = req.body;
  const client = new MongoClient(MONGO_URI_RALF);

  try {
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
    await client.close();
  }
};

const updateBarberProfile = async (req, res) => {
  const { barberId, barberInfo } = req.body;
  const client = new MongoClient(MONGO_URI_RALF);

  try {
    const db = client.db("HollywoodBarberShop");
    const query = { _id: barberId };
    const newValues = {
      $set: {
        given_name: barberInfo.given_name,
        family_name: barberInfo.family_name,
        email: barberInfo.email,
        description: barberInfo.description,
        french_description: barberInfo.french_description,
        picture: barberInfo.picture,
      },
    };
    await db.collection("admin").updateOne(query, newValues);
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.error("Error updating barber profile:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

const updateText = async (req, res) => {
  const { textId, content, french } = req.body;
  const client = new MongoClient(MONGO_URI_RALF);

  try {
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
  } finally {
    await client.close();
  }
};

const updateClient = async (req, res) => {
  const _id = req.body[1];
  const field = Object.keys(req.body[0])[0];
  const value = Object.values(req.body[0])[0];
  const client = new MongoClient(MONGO_URI_RALF);

  try {
    const db = client.db("HollywoodBarberShop");
    const query = { _id: _id };
    const newValues = { $set: { [field]: value } };
    await db.collection("Clients").updateOne(query, newValues);
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.error("Error updating client:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

const updateServices = async (req, res) => {
  const serviceEdit = req.body[1];
  const role = req.body[0];
  const client = new MongoClient(MONGO_URI_RALF);

  try {
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
  } finally {
    await client.close();
  }
};

const updateClientNote = async (req, res) => {
  const { client_id, note } = req.body;
  const client = new MongoClient(MONGO_URI_RALF);

  try {
    const db = client.db("HollywoodBarberShop");
    await db
      .collection("Clients")
      .updateOne({ _id: client_id }, { $set: { note: note } });
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.error("Error updating client note:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
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
  sendReminders,
  sendData,
};

// availability: PATCH REQUEST
// Client Res: Note to add
// when res delete, remove from client
