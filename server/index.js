// Use strict mode and import necessary modules
"use strict";
const express = require("express");
const morgan = require("morgan");
const cors = require("cors"); // Import the cors package
const PORT = 4000;
const {
  adminCheck,
  getUserInfo,
  updateAvailability,
  addReservation,
  addTimeOff,
  uploadImage,
  getSlideshowImages,
  deleteImage,
  deleteTimeOff,
  updateReservation,
  deleteReservation,
  deleteBarberProfile,
  updateBarberProfile,
  addBarber,
  updateText,
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
app.get("/getUserInfo", getUserInfo);
app.get("/getSlideshowImages", getSlideshowImages);
app.post("/addReservation", addReservation);
app.post("/checkIfAdmin", adminCheck);
app.post("/addBarber", addBarber);
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
// Start the server
app.listen(PORT, () => console.info(`Listening on port ${PORT}`));
