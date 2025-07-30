"use strict";
const express = require("express");
const morgan = require("morgan");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const PORT = process.env.PORT || 4000;

const {
  deleteBlockedSlot,
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
  updateClientNote,
  deleteClient,
  deleteService,
  updateDailyAvailability,
  sendReminders,
  sendData,
  getUserInfoInWebTools,
  blockSlot,
  getDataPage,
} = require("./server");

const app = express();

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.static("./server/assets"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/", express.static(__dirname + "/"));

app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Welcome to my server");
});
app.get("/getUserInfo", getUserInfo);
app.get("/search/:searchTerm", getSearchResults);
app.get("/clients", getClients);
app.get("/getClientNote/:client_id", getClientNotes);
app.get("/events", sendData);
app.get("/getDataPage", getDataPage);
app.get("/getUserInfoInWebTools", getUserInfoInWebTools);
app.post("/logout", logout);
app.post("/login", login);
app.post("/addReservation", addReservation);
app.post("/addBarber", addBarber);
app.post("/sendReminder", sendReminders);
app.post("/blockSlot", blockSlot);
app.patch("/updateClient", updateClient);
app.patch("/upload", uploadImage);
app.patch("/updateAvailability", updateAvailability);
app.patch("/addTimeOff", addTimeOff);
app.patch("/updateReservation", updateReservation);
app.patch("/updateBarberProfile", updateBarberProfile);
app.patch("/updateText", updateText);
app.patch("/updateServices", updateServices);
app.patch("/updateClientNote", updateClientNote);
app.patch("/updateDailyAvailability", updateDailyAvailability);
app.delete("/deleteBlockedSlot/:_id", deleteBlockedSlot);
app.delete("/images/:_id", deleteImage);
app.delete("/deleteTimeOff", deleteTimeOff);
app.delete("/deleteReservation", deleteReservation);
app.delete("/deleteBarberProfile", deleteBarberProfile);
app.delete("/deleteClient/:_id", deleteClient);
app.delete("/deleteService/:_id", deleteService);

const server = http.createServer(app);
server.listen(PORT, () => {
  console.info(`Listening on port ${PORT}`);
});
