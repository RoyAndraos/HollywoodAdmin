"use strict";
const express = require("express");
const morgan = require("morgan");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors"); // Import the cors package
const PORT = 4000;

const {
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
app.get("/getUserInfo", getUserInfo);
app.get("/search/:searchTerm", getSearchResults);
app.get("/clients", getClients);
app.post("/addReservation", addReservation);
app.post("/checkIfAdmin", adminCheck);
app.post("/addBarber", addBarber);
app.patch("/updateClient", updateClient);
app.patch("/upload", uploadImage);
app.patch("/updateAvailability", updateAvailability);
app.patch("/addTimeOff", addTimeOff);
app.patch("/updateReservation", updateReservation);
app.patch("/updateBarberProfile", updateBarberProfile);
app.patch("/updateText", updateText);
app.delete("/images/:_id", deleteImage);
app.delete("/deleteTimeOff", deleteTimeOff);
app.delete("/deleteReservation/:_id", deleteReservation);
app.delete("/deleteBarberProfile", deleteBarberProfile);

const server = http.createServer(app); // Create an HTTP server

const io = socketIo(server, {
  cors: {
    origin: "*", // This is the URL of the React app
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
