"use strict";
const express = require("express");
const morgan = require("morgan");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors"); // Import the cors package
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

// Create the express app
const app = express();

// Add middleware for handling CORS
app.use(cors()); // Enable CORS for all origins. Replace with specific origin(s) if needed.

// Add middleware for logging
app.use(morgan("tiny"));

// Add middleware to serve static assets
app.use(express.static("./server/assets"));

// Add middleware for parsing JSON data with limit
app.use(express.json({ limit: "50mb" }));

// Add middleware for parsing URL-encoded data with limit
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve the static files from the root directory
app.use("/", express.static(__dirname + "/"));

// Define the routes
app.get("/", (req, res) => {
  res.send("Welcome to my server");
});
app.get("/getUserInfo", verifyToken, getUserInfo);
app.get("/search/:searchTerm", verifyToken, getSearchResults); //
app.get("/clients", verifyToken, getClients); //
app.get("/getClientNote/:client_id", verifyToken, getClientNotes); //
app.get("/clientByName/:name", verifyToken, getClientByName); //
app.post("/logout", logout);
app.post("/login", login);
app.post("/addReservation", verifyToken, addReservation); //
app.post("/addBarber", verifyToken, addBarber); //
app.patch("/updateClient", verifyToken, updateClient); //
app.patch("/upload", verifyToken, uploadImage); //
app.patch("/updateAvailability", verifyToken, updateAvailability); //
app.patch("/addTimeOff", verifyToken, addTimeOff); //
app.patch("/updateReservation", verifyToken, updateReservation); //
app.patch("/updateBarberProfile", verifyToken, updateBarberProfile); //
app.patch("/updateText", verifyToken, updateText); //
app.patch("/updateServices", verifyToken, updateServices); //
app.patch("/updateClientNote", verifyToken, updateClientNote); //
app.patch("/updateDailyAvailability", verifyToken, updateDailyAvailability); //
app.delete("/images/:_id", verifyToken, deleteImage);
app.delete("/deleteTimeOff", verifyToken, deleteTimeOff); //
app.delete("/deleteReservation", verifyToken, deleteReservation); //
app.delete("/deleteBarberProfile", verifyToken, deleteBarberProfile); //
app.delete("/deleteClient/:_id", verifyToken, deleteClient); //
app.delete("/deleteService/:_id", verifyToken, deleteService); //

const server = http.createServer(app); // Create an HTTP server

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// Socket.IO logic for real-time communication
io.on("connection", (socket) => {
  socket.on("disconnect", () => {});
});

server.listen(PORT, () => {
  console.info(`Listening on port ${PORT}`);
});

startChangeStream(io); // Pass the io instance to the function
