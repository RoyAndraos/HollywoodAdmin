require("dotenv").config();
const { dailyAvailability } = require("./batchImport");
const { v4: uuid } = require("uuid");
// const { initialAvailability } = require("./helpers");
const { weekDays } = require("./helpers");
const moment = require("moment");
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------
// Mailtrap stuff
// ---------------------------------------------------------------------------------------------
const { MailtrapClient } = require("mailtrap");
const mailtrapClient = new MailtrapClient({
  token: process.env.EMAIL_TOKEN,
});

//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
//MONGO STUFF
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
const { connectMongo } = require("./mongo");
const { MongoClient } = require("mongodb");
(async () => {
  try {
    await connectMongo(); // call connect once at startup
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
})();

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

  // Start listening to changes
  await changeStreamClient.connect();

  let changeStream;
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

  // Handle errors
  changeStream.on("error", (error) => {
    console.error("Change Stream error:", error);
  });

  const closeClient = () => {
    changeStream.close(() => {
      changeStreamClient.close(() => {
        process.exit(0);
      });
    });
  };

  changeStream.on("close", () => {
    process.exit(0);
  });

  process.on("SIGINT", closeClient);
  process.on("SIGTERM", closeClient);
};

//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
//TOKEN STUFF
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
const jwt = require("jsonwebtoken");
const JWT_TOKEN_KEY = process.env.JWT_TOKEN_KEY;
// const verifyToken = async (req, res, next) => {
//   const token = req.headers.authorization;
//   try {
//
//
//
//     const isRevoked = await db.collection("revoked").findOne({ token: token });
//     if (isRevoked) {
//       await client.close();
//       return res.status(401).json({ message: "Invalid credentials" });
//     }
//     await client.close(); // Close connection after checking token
//   } catch (err) {
//     console.error("Error verifying token:", err);
//   }
//   if (!token) {
//     return res.status(401).json({ message: "Token is missing" });
//   }
//   jwt.verify(token, JWT_TOKEN_KEY, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "Invalid token" });
//     }
//     // Token is valid; user identification is available in decoded.userId
//     req.userId = decoded.userId;
//     next();
//   });
// };
//TWILIO STUFF
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
const accountSid = process.env.SMS_SSID;
const authToken = process.env.SMS_AUTH_TOKEN;
const twilioClient = require("twilio")(accountSid, authToken);
const telnyxApiKey = process.env.SMS_API_KEY_TELNYX;
const initTelnyx = async () => {
  const Telnyx = (await import("telnyx")).default;
  return new Telnyx(telnyxApiKey);
};
//---------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
//GET REQUESTS
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

const getResById = async (req, res) => {
  try {
    const db = await connectMongo();
    const { _id } = req.query;
    if (!_id) {
      return res.status(400).json({ error: "Missing id in query" });
    }
    const reservation = await db
      .collection("reservations")
      .findOne({ _id: _id });
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    } else {
      const allReservations = await db
        .collection("reservations")
        .find({
          date: reservation.date,
        })
        .toArray();
      return res
        .status(200)
        .json({ status: 200, reservations: allReservations });
    }
  } catch {}
};

const getBarbers = async (req, res) => {
  try {
    const db = await connectMongo();
    const barbers = await db
      .collection("admin")
      .find(
        {},
        {
          projection: {
            email: 0,
            picture: 0,
            description: 0,
            french_description: 0,
          },
        }
      )
      .toArray();
    res.status(200).json({
      message: "Barbers retrieved successfully",
      barbers: barbers,
    });
  } catch (error) {
    console.error("Error fetching barbers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAvailability = async (req, res) => {
  try {
    const db = await connectMongo();
    const availabilityData = await db
      .collection("admin")
      .find(
        {},
        {
          projection: {
            email: 0,
            picture: 0,
            description: 0,
            french_description: 0,
            family_name: 0,
          },
        }
      )
      .toArray();
    res.status(200).json({
      message: "Availability data retrieved",
      availability: availabilityData,
    });
  } catch (error) {
    console.error("Error fetching availability data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getCalendar = async (req, res) => {
  const { view, day, month, year } = req.query;
  let formatted;
  const options = {
    timeZone: "America/Toronto",
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  if (view === "day") {
    const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(
      new Date(day)
    );
    formatted =
      `${parts.find((p) => p.type === "weekday").value} ` +
      `${parts.find((p) => p.type === "month").value} ` +
      `${parts.find((p) => p.type === "day").value} ` +
      `${parts.find((p) => p.type === "year").value}`;
    console.log("Formatted date:", formatted);
    try {
      const db = await connectMongo();
      const calendarData = await db
        .collection("reservations")
        .find({ date: formatted })
        .toArray();
      const blockedSlots = await db
        .collection("blockedSlots")
        .find({ date: formatted })
        .toArray();
      res.status(200).json({
        message: "Calendar data retrieved",
        reservations: calendarData,
        blockedSlots: blockedSlots,
      });
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else if (view === "month") {
    try {
      const db = await connectMongo();
      const monthYearRegex = new RegExp(`${month.slice(0, 3)}.*${year}`, "i");

      const calendarData = await db
        .collection("reservations")
        .find({ date: { $regex: monthYearRegex } })
        .toArray();

      res.status(200).json({
        message: "Calendar data retrieved",
        reservations: calendarData,
      });
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      res.status(500).json({ message: "Internal server error" });
    } finally {
      await client.close();
    }
  }
};

const getDataPage = async (req, res) => {
  const { startDate, endDate } = req.query; // Expecting something like: "2024-03-01" and "2024-04-01"

  try {
    const db = await connectMongo();
    const [clients, reservations] = await Promise.all([
      db.collection("Clients").find().toArray(),
      db
        .collection("reservations")
        .find({
          $expr: {
            $and: [
              { $gt: [{ $toDate: "$date" }, new Date(startDate)] }, // strictly greater
              { $lt: [{ $toDate: "$date" }, new Date(endDate)] }, // strictly less
            ],
          },
        })
        .toArray(),
    ]);

    res.status(200).json({
      status: 200,
      clients,
      reservations,
    });
  } catch (err) {
    console.error("Error getting data page:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};
const getClients = async (req, res) => {
  const page = parseInt(req.query.page); // Current page number, default to 1
  const limit = parseInt(req.query.limit); // Number of items per page, default to 10
  const skip = (page - 1) * limit; // Calculate skip value

  try {
    const db = await connectMongo();
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
    const db = await connectMongo();
    const clientData = await db.collection("Clients").findOne({ _id: _id });
    res.status(200).json({ status: 200, data: clientData.note });
  } catch (err) {
    console.error("Error getting client notes:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getSearchResults = async (req, res) => {
  const searchTerm = req.params.searchTerm;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;

  try {
    const db = await connectMongo();
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
const getServices = async (req, res) => {
  try {
    const db = await connectMongo();
    const services = await db.collection("services").find().toArray();
    res.status(200).json({ status: 200, data: services });
  } catch (err) {
    console.error("Error getting services:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};
const getClientInfoForBooking = async (req, res) => {
  try {
    const db = await connectMongo();
    const clients = await db
      .collection("Clients")
      .find({}, { projection: { reservations: 0, note: 0 } })
      .toArray();
    res.status(200).json({ status: 200, clients: clients });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};
const getUserInfoInWebTools = async (req, res) => {
  try {
    const db = await connectMongo();
    const [userInfo, services, text] = await Promise.all([
      db
        .collection("admin")
        .find({}, { projection: { picture: 0 } })
        .toArray(),
      db.collection("services").find().toArray(),
      db.collection("web_text").find().toArray(),
    ]);

    res.status(200).json({
      status: 200,
      userInfo: userInfo,
      services: services,
      text: text,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const db = await connectMongo();
    // Get the current date and determine the months to query
    const now = new Date();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = now.getMonth();

    // Calculate the months to query
    const monthsToQuery = [
      months[(currentMonth - 1 + 12) % 12], // Previous month
      months[currentMonth], // Current month
      months[(currentMonth + 1) % 12], // Next month
      months[(currentMonth + 2) % 12], // Month after next
    ];

    // Use Promise.all for parallel fetching
    const [
      userInfo,
      reservationsArrays,
      services,
      text,
      clients,
      blockedSlots,
      // employeeServices,
    ] = await Promise.all([
      db
        .collection("admin")
        .find(
          {},
          {
            projection: {
              picture: 0,
              description: 0,
              french_description: 0,
              email: 0,
            },
          }
        )
        .toArray(),

      // Fetch reservations for all months in parallel
      Promise.all(
        monthsToQuery.map((month) => {
          const query = { date: { $regex: month, $options: "i" } };
          return db.collection("reservations").find(query).toArray();
        })
      ),

      db.collection("services").find().toArray(),
      db.collection("web_text").find().toArray(),
      db
        .collection("Clients")
        .find({}, { projection: { _id: 0, email: 0, reservations: 0 } })
        .toArray(),
      Promise.all(
        monthsToQuery.map((month) => {
          const query = { date: { $regex: month, $options: "i" } };
          return db.collection("blockedSlots").find(query).toArray();
        })
      ),
      // db.collection("servicesEmp").find().toArray(),
    ]);
    const blockedSlotsToReturn = blockedSlots.flat();
    // Combine all reservations into a single array
    const reservations = reservationsArrays.flat();

    // Send the response
    res.status(200).json({
      status: 200,
      userInfo,
      reservations,
      services,
      text,
      clients,
      blockedSlotsToReturn,
      // employeeServices,
    });
  } catch (err) {
    console.error("Error in getUserInfo:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

//POST REQUESTS
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

const blockSlot = async (req, res) => {
  const { block } = req.body;

  const _id = uuid();
  try {
    const db = await connectMongo();
    const query = {
      _id: _id,
      date: block.date,
      slot: block.slot,
      barber: block.barber,
    };
    await db.collection("blockedSlots").insertOne(query);
    res.status(200).json({ status: 200, _id: _id, message: "success" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const sendReminders = async (req, res) => {
  try {
    const db = await connectMongo();

    // ---- 1. GET TOMORROW IN MONTREAL TIME ----
    // Convert current time to Montreal local time using a string trick
    const nowMtlString = new Date().toLocaleString("en-CA", {
      timeZone: "America/Toronto",
    });

    const nowMtl = new Date(nowMtlString);
    nowMtl.setDate(nowMtl.getDate() + 1); // Add one day (Montreal-safe)

    // ---- 2. FORMAT EXACTLY LIKE toDateString() (NO COMMAS) ----
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Toronto",
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    const parts = formatter.formatToParts(nowMtl);

    const tomorrowString =
      `${parts.find((p) => p.type === "weekday").value} ` +
      `${parts.find((p) => p.type === "month").value} ` +
      `${parts.find((p) => p.type === "day").value} ` +
      `${parts.find((p) => p.type === "year").value}`;

    console.log("🔍 Montreal Tomorrow:", tomorrowString);

    // ---- 3. QUERY DB FOR EXACT DATE MATCH ----
    const reservations = await db
      .collection("reservations")
      .find({ date: tomorrowString })
      .toArray();

    if (reservations.length === 0) {
      return res.status(200).json({
        status: 200,
        message: "No reservations for tomorrow",
      });
    }

    // ---- 4. SEND REMINDERS ----
    const results = await Promise.all(
      reservations.map(async (reservation) => {
        return await twilioClient.messages.create({
          messagingServiceSid: "MG92cdedd67c5d2f87d2d5d1ae14085b4b",
          to: reservation.number,
          body: `Salut ${
            reservation.fname
          }, un rappel pour votre rendez-vous demain au Hollywood Barbershop avec ${
            reservation.barber
          } à ${reservation.slot[0].split("-")[1]}. À bientôt !`,
        });
      })
    );

    // ---- 5. RESPONSE ----
    res.status(200).json({
      status: 200,
      count: results.length,
      message: "Reminders sent",
    });
  } catch (err) {
    console.error("Error sending reminders:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const correctUsername =
      process.env.LOGIN_USERNAME.toLowerCase() === username.toLowerCase();
    const correctPassword = process.env.LOGIN_PASSWORD === password;
    const correctJordiUsername =
      process.env.JORDI_USERNAME.toLowerCase() === username.toLowerCase();
    const correctJordiPassword = process.env.JORDI_PASSWORD === password;
    if (correctPassword && correctUsername) {
      const token = jwt.sign({ userId: "admin" }, JWT_TOKEN_KEY, {
        expiresIn: "13h",
      });
      res.status(200).json({ status: 200, token: token, role: "admin" });
    } else if (correctJordiUsername && correctJordiPassword) {
      const token = jwt.sign({ userId: "employee" }, JWT_TOKEN_KEY, {
        expiresIn: "13h",
      });
      res.status(200).json({ status: 200, token: token, role: "jordi" });
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
    const db = await connectMongo();
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
    const db = await connectMongo();
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
          // (async () => {
          //   const telnyx = await initTelnyx();
          await twilioClient.messages.create({
            body: `No Reply ~Hollywood Barbershop
             réservation confirmée pour ${
               reservation.fname
             } le ${frenchDate} à ${reservation.slot[0].split("-")[1]} avec ${
              reservation.barber
            }.

Annulation: https://hollywoodfairmountbarbers.com/cancel/${
              reservationToSend._id
            }
            `,
            messagingServiceSid: "MG92cdedd67c5d2f87d2d5d1ae14085b4b",
            // messaging_profile_id: process.env.SMS_PROFILE_ID,
            // from: "+18334041832",
            to: reservationToSend.number,
          });
          // })();
        } catch (err) {
          console.error(
            "Telnyx error:",
            JSON.stringify(err.raw?.errors, null, 2)
          );
        }
      } else if (reservation.sendEmail) {
        const emailData = {
          from: "hello@hollywoodfairmountbarbers.com",
          to: reservationToSend.email,
          subject: "Reservation Confirmation",
          text: `No Reply ~Hollywood Barbershop
            Bonjour ${reservation.fname} ${
            reservation.lname || ""
          }, votre réservation au Hollywood Barbershop est confirmée pour aujourd'hui à ${
            reservation.slot[0].split("-")[1]
          } avec ${reservation.barber}. Vous recevrez une ${
            reservation.service.name
          } pour ${reservation.service.price} CAD. ~Hollywood Barbershop
    
            Hello ${reservation.fname} ${
            reservation.lname || ""
          }, your reservation at Hollywood Barbershop is confirmed for today at ${
            reservation.slot[0].split("-")[1]
          } with ${reservation.barber}. You will be getting a ${
            reservation.service.english
          } for ${reservation.service.price} CAD. 
              Pour annuler (to cancel): https://hollywoodfairmountbarbers.com/cancel/${
                reservation._id
              }
            `,
          category: "Reservation Confirmation",
        };
        await mailtrapClient.sendEmail(emailData);
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
          // const telnyx = await initTelnyx(); // make sure this returns new Telnyx(apiKey)

          await twilioClient.messages.create({
            body: `No Reply ~Hollywood Barbershop
Réservation confirmée pour ${reservation.fname} le ${frenchDate} à ${
              reservation.slot[0].split("-")[1]
            } avec ${reservation.barber}.
Annulation: https://hollywoodfairmountbarbers.com/cancel/${
              reservationToSend._id
            }`,
            messagingServiceSid: "MG92cdedd67c5d2f87d2d5d1ae14085b4b",
            // from: "+18334041832",
            to: reservationToSend.number,
          });
        } catch (smsError) {
          console.error(
            "Telnyx error:",
            JSON.stringify(smsError.raw?.errors, null, 2)
          );
          return res.status(500).json({
            status: 500,
            message: "Error sending SMS",
            detail: smsError.raw?.errors ?? smsError.message,
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
  }
};

const addTimeOff = async (req, res) => {
  const { startDate, endDate, _id } = req.body;

  try {
    const db = await connectMongo();
    // Ensure start and end dates are in UTC for the entire day
    const start = moment.utc(startDate).startOf("day").toISOString();
    const end = moment.utc(endDate).endOf("day").toISOString();

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
    const db = await connectMongo();
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
  }
};

const addBarber = async (req, res) => {
  const barberInfo = req.body.barberInfo;
  const _id = uuid();

  try {
    const db = await connectMongo();
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
const deleteBlockedSlot = async (req, res) => {
  const { _id } = req.params;

  try {
    const db = await connectMongo();
    await db.collection("blockedSlots").deleteOne({ _id: _id });
    res
      .status(200)
      .json({ status: 200, _id: _id, message: "blocked slot deleted" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};
const deleteService = async (req, res) => {
  const { _id } = req.params;

  try {
    const db = await connectMongo();
    await db.collection("services").deleteOne({ _id: _id });
    res.status(200).json({ status: 200, _id: _id });
  } catch {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteBarberProfile = async (req, res) => {
  const { barberId } = req.body;

  try {
    const db = await connectMongo();
    await db.collection("admin").deleteOne({ _id: barberId });
    res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.error("Error deleting barber profile:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const db = await connectMongo();
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
    const db = await connectMongo();
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

  const sendSMS = req.body.sendSMS;
  try {
    const db = await connectMongo();
    const reservation = await db
      .collection("reservations")
      .findOne({ _id: _id });
    await db.collection("reservations").deleteOne({ _id: _id });
    await db
      .collection("Clients")
      .updateOne(
        { _id: reservation.client_id },
        { $pull: { reservations: _id } }
      );

    if (sendSMS === true) {
      // send message to client
      try {
        // const telnyx = await initTelnyx();
        await twilioClient.messages.create({
          text: `Bonjour, votre réservation a été annulée. ~Hollywood Barbershop

            Hello, your reservation has been cancelled. ~Hollywood Barbershop
        `,
          messagingServiceSid: "MG92cdedd67c5d2f87d2d5d1ae14085b4b",
          // from: "+18334041832",
          to: reservation.number,
        });
      } catch (err) {
        console.error(
          "Telnyx error:",
          JSON.stringify(err.raw?.errors, null, 2)
        );
      }
    }

    // Respond with success
    res.status(200).json({
      status: 200,
      message: "Reservation successfully deleted.",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteClient = async (req, res) => {
  const _id = req.params._id;

  try {
    const db = await connectMongo();
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
    const db = await connectMongo();
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
    const db = await connectMongo();
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
    const db = await connectMongo();
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
    const db = await connectMongo();
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
  }
};

const updateText = async (req, res) => {
  const { textId, content, french } = req.body;

  try {
    const db = await connectMongo();
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
  try {
    const db = await connectMongo();
    const { _id, ...updatedData } = req.body; // Extract _id and updated fields

    const query = { _id: _id };
    const update = { $set: updatedData }; // Use $set to update only changed fields

    const result = await db.collection("Clients").updateOne(query, update);

    if (result.matchedCount === 0) {
      return res.status(404).json({ status: 404, message: "Client not found" });
    }

    res
      .status(200)
      .json({ status: 200, message: "Client updated successfully" });
  } catch (err) {
    console.error("Error updating client:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const updateServices = async (req, res) => {
  const serviceEdit = req.body;

  try {
    const db = await connectMongo();
    // if (role === "admin") {
    await db
      .collection("services")
      .updateOne({ _id: serviceEdit._id }, { $set: serviceEdit });
    // } else {
    //   await db
    //     .collection("servicesEmp")
    //     .updateOne({ _id: serviceEdit._id }, { $set: serviceEdit });
    // }

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
    const db = await connectMongo();
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
  deleteBlockedSlot,
  blockSlot,
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
  login,
  logout,
  updateServices,
  getClientNotes,
  getServices,
  updateClientNote,
  getAvailability,
  deleteClient,
  deleteService,
  updateDailyAvailability,
  sendReminders,
  sendData,
  getUserInfoInWebTools,
  getDataPage,
  getCalendar,
  getBarbers,
  getClientInfoForBooking,
  getResById,
};
