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
app.post("/upload", uploadImage);
app.post("/addReservation", addReservation);
app.post("/checkIfAdmin", adminCheck);
app.patch("/updateAvailability", updateAvailability);
app.patch("/addTimeOff", addTimeOff);
app.delete("/images/:_id", deleteImage);
app.delete("/deleteTimeOff", deleteTimeOff);
// Start the server
app.listen(PORT, () => console.info(`Listening on port ${PORT}`));
