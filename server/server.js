require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const { v4: uuid } = require("uuid");
const { initialAvailability } = require("./helpers");
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const MONGO_URI = process.env.MONGO_URI;
const WHITE_LIST = process.env.WHITE_LIST;

const uploadImage = async (req, res) => {
  const _id = uuid();
  const client = new MongoClient(MONGO_URI, options);
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
          _id: new ObjectId(`${filename}`),
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

const deleteBarberProfile = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
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

const addReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { reservation } = req.body;
  const _id = uuid();
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    await db.collection("reservations").insertOne({
      name: reservation.clientName,
      email: reservation.clientEmail,
      number: reservation.clientNumber,
      barber: reservation.barber,
      service: reservation.service,
      date: reservation.date,
      slot: reservation.slot,
      _id: _id,
    });
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

    res.status(200).json({ status: 200, message: "success", data: _id });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const addTimeOff = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { startDate, endDate, _id } = req.body;
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    await db.collection("admin").updateOne(
      {
        _id: new ObjectId(`${_id}`),
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

const deleteImage = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const query = { _id: req.params._id };
    await db.collection("Images").deleteOne(query);
    res.status(200).json({ status: 200, data: query });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const deleteTimeOff = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { _id, startDate, endDate } = req.body;
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const query = {
      _id: new ObjectId(`${_id}`),
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

const updateReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
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
const deleteReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
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

const getSlideshowImages = async (req, res) => {
  res.status(200).json({ status: 200, message: "success" });
};

const updateBarberProfile = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { barberId, barberInfo } = req.body;
  console.log(req.body);
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const query = { _id: new ObjectId(`${barberId}`) };
    const newValues = {
      $set: {
        name: barberInfo.name,
        availability: barberInfo.availability,
        picture: barberInfo.picture,
        bio: barberInfo.bio,
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

const addBarber = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const barberInfo = req.body.barberInfo;
  console.log(req.body);
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const newBarber = await db.collection("admin").insertOne({
      _id: new ObjectId(),
      given_name: barberInfo.given_name,
      family_name: barberInfo.family_name,
      email: barberInfo.email,
      picture: "",
      description: barberInfo.description,
      time_off: [],
      availability: initialAvailability,
    });
    res.status(200).json({ status: 200, message: "success", data: newBarber });
  } catch (err) {
    console.error("Error adding barber:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const updateText = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { textId, text } = req.body;
  console.log(req.body);
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

module.exports = {
  adminCheck,
  getUserInfo,
  updateAvailability,
  addReservation,
  addTimeOff,
  uploadImage,
  deleteImage,
  getSlideshowImages,
  deleteTimeOff,
  updateReservation,
  deleteReservation,
  deleteBarberProfile,
  updateBarberProfile,
  addBarber,
  updateText,
};
