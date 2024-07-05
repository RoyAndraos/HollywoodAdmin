"use strict";
const express = require("express");
const morgan = require("morgan");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const PORT = process.env.PORT || 4000;

const {
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
} = require("./server");

const app = express();

app.use(
  cors({
    origin: ["http://your-frontend-domain.com"], // Replace with your frontend domain
  })
);
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.static("./server/assets"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/", express.static(__dirname + "/"));

app.get("/", (req, res) => {
  res.send("Welcome to my server");
});
app.get("/getUserInfo", verifyToken, getUserInfo);
app.get("/search/:searchTerm", verifyToken, getSearchResults);
app.get("/clients", verifyToken, getClients);
app.get("/getClientNote/:client_id", verifyToken, getClientNotes);
app.get("/clientByName/:name", verifyToken, getClientByName);
app.post("/logout", logout);
app.post("/login", login);
app.post("/addReservation", addReservation);
app.post("/addBarber", verifyToken, addBarber);
app.patch("/updateClient", verifyToken, updateClient);
app.patch("/upload", verifyToken, uploadImage);
app.patch("/updateAvailability", verifyToken, updateAvailability);
app.patch("/addTimeOff", verifyToken, addTimeOff);
app.patch("/updateReservation", verifyToken, updateReservation);
app.patch("/updateBarberProfile", verifyToken, updateBarberProfile);
app.patch("/updateText", verifyToken, updateText);
app.patch("/updateServices", verifyToken, updateServices);
app.patch("/updateClientNote", verifyToken, updateClientNote);
app.patch("/updateDailyAvailability", verifyToken, updateDailyAvailability);
app.delete("/images/:_id", verifyToken, deleteImage);
app.delete("/deleteTimeOff", verifyToken, deleteTimeOff);
app.delete("/deleteReservation", deleteReservation);
app.delete("/deleteBarberProfile", verifyToken, deleteBarberProfile);
app.delete("/deleteClient/:_id", verifyToken, deleteClient);
app.delete("/deleteService/:_id", verifyToken, deleteService);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.info(`Listening on port ${PORT}`);
});

startChangeStream(io);

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});
