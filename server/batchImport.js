const { MongoClient } = require("mongodb");
require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI_RALF;

const data = [
  {
    given_name: "Roy",
    family_name: "andraos",
    name: "roy andraos",
    picture:
      "https://lh3.googleusercontent.com/a/AGNmyxZ42A67uSF3cQwZmkh3Ja5Nnjxonx7Q5HL2FYI9=s96-c",
    email: "roy_andraos@live.fr",
    timeOff: [],
    availability: [
      { slot: "Mon-9:00am", available: true, booked: false },
      { slot: "Mon-9:15am", available: true, booked: false },
      { slot: "Mon-9:30am", available: true, booked: false },
      { slot: "Mon-9:45am", available: true, booked: false },
      { slot: "Mon-10:00am", available: true, booked: false },
      { slot: "Mon-10:15am", available: true, booked: false },
      { slot: "Mon-10:30am", available: true, booked: false },
      { slot: "Mon-10:45am", available: true, booked: false },
      { slot: "Mon-11:00am", available: true, booked: false },
      { slot: "Mon-11:15am", available: true, booked: false },
      { slot: "Mon-11:30am", available: true, booked: false },
      { slot: "Mon-11:45am", available: true, booked: false },
      { slot: "Mon-12:00pm", available: true, booked: false },
      { slot: "Mon-12:15pm", available: true, booked: false },
      { slot: "Mon-12:30pm", available: true, booked: false },
      { slot: "Mon-12:45pm", available: true, booked: false },
      { slot: "Mon-1:00pm", available: true, booked: false },
      { slot: "Mon-1:15pm", available: true, booked: false },
      { slot: "Mon-1:30pm", available: true, booked: false },
      { slot: "Mon-1:45pm", available: true, booked: false },
      { slot: "Mon-2:00pm", available: true, booked: false },
      { slot: "Mon-2:15pm", available: true, booked: false },
      { slot: "Mon-2:30pm", available: true, booked: false },
      { slot: "Mon-2:45pm", available: true, booked: false },
      { slot: "Mon-3:00pm", available: true, booked: false },
      { slot: "Mon-3:15pm", available: true, booked: false },
      { slot: "Mon-3:30pm", available: true, booked: false },
      { slot: "Mon-3:45pm", available: true, booked: false },
      { slot: "Mon-4:00pm", available: true, booked: false },
      { slot: "Mon-4:15pm", available: true, booked: false },
      { slot: "Mon-4:30pm", available: true, booked: false },
      { slot: "Mon-4:45pm", available: true, booked: false },
      { slot: "Mon-5:00pm", available: true, booked: false },
      { slot: "Mon-5:15pm", available: true, booked: false },
      { slot: "Mon-5:30pm", available: true, booked: false },
      { slot: "Mon-5:45pm", available: true, booked: false },
      { slot: "Mon-6:00pm", available: true, booked: false },
      { slot: "Mon-6:15pm", available: true, booked: false },
      { slot: "Mon-6:30pm", available: true, booked: false },
      { slot: "Mon-6:45pm", available: true, booked: false },
      { slot: "Mon-7:00pm", available: true, booked: false },
      { slot: "Mon-7:15pm", available: true, booked: false },
      { slot: "Mon-7:30pm", available: true, booked: false },
      { slot: "Mon-7:45pm", available: true, booked: false },
      { slot: "Tue-9:00am", available: true, booked: false },
      { slot: "Tue-9:15am", available: true, booked: false },
      { slot: "Tue-9:30am", available: true, booked: false },
      { slot: "Tue-9:45am", available: true, booked: false },
      { slot: "Tue-10:00am", available: true, booked: false },
      { slot: "Tue-10:15am", available: true, booked: false },
      { slot: "Tue-10:30am", available: true, booked: false },
      { slot: "Tue-10:45am", available: true, booked: false },
      { slot: "Tue-11:00am", available: true, booked: false },
      { slot: "Tue-11:15am", available: true, booked: false },
      { slot: "Tue-11:30am", available: true, booked: false },
      { slot: "Tue-11:45am", available: true, booked: false },
      { slot: "Tue-12:00pm", available: true, booked: false },
      { slot: "Tue-12:15pm", available: true, booked: false },
      { slot: "Tue-12:30pm", available: true, booked: false },
      { slot: "Tue-12:45pm", available: true, booked: false },
      { slot: "Tue-1:00pm", available: true, booked: false },
      { slot: "Tue-1:15pm", available: true, booked: false },
      { slot: "Tue-1:30pm", available: true, booked: false },
      { slot: "Tue-1:45pm", available: true, booked: false },
      { slot: "Tue-2:00pm", available: true, booked: false },
      { slot: "Tue-2:15pm", available: true, booked: false },
      { slot: "Tue-2:30pm", available: true, booked: false },
      { slot: "Tue-2:45pm", available: true, booked: false },
      { slot: "Tue-3:00pm", available: true, booked: false },
      { slot: "Tue-3:15pm", available: true, booked: false },
      { slot: "Tue-3:30pm", available: true, booked: false },
      { slot: "Tue-3:45pm", available: true, booked: false },
      { slot: "Tue-4:00pm", available: true, booked: false },
      { slot: "Tue-4:15pm", available: true, booked: false },
      { slot: "Tue-4:30pm", available: true, booked: false },
      { slot: "Tue-4:45pm", available: true, booked: false },
      { slot: "Tue-5:00pm", available: true, booked: false },
      { slot: "Tue-5:15pm", available: true, booked: false },
      { slot: "Tue-5:30pm", available: true, booked: false },
      { slot: "Tue-5:45pm", available: true, booked: false },
      { slot: "Tue-6:00pm", available: true, booked: false },
      { slot: "Tue-6:15pm", available: true, booked: false },
      { slot: "Tue-6:30pm", available: true, booked: false },
      { slot: "Tue-6:45pm", available: true, booked: false },
      { slot: "Tue-7:00pm", available: true, booked: false },
      { slot: "Tue-7:15pm", available: true, booked: false },
      { slot: "Tue-7:30pm", available: true, booked: false },
      { slot: "Tue-7:45pm", available: true, booked: false },
      { slot: "Wed-9:00am", available: true, booked: false },
      { slot: "Wed-9:15am", available: true, booked: false },
      { slot: "Wed-9:30am", available: true, booked: false },
      { slot: "Wed-9:45am", available: true, booked: false },
      { slot: "Wed-10:00am", available: true, booked: false },
      { slot: "Wed-10:15am", available: true, booked: false },
      { slot: "Wed-10:30am", available: true, booked: false },
      { slot: "Wed-10:45am", available: true, booked: false },
      { slot: "Wed-11:00am", available: true, booked: false },
      { slot: "Wed-11:15am", available: true, booked: false },
      { slot: "Wed-11:30am", available: true, booked: false },
      { slot: "Wed-11:45am", available: true, booked: false },
      { slot: "Wed-12:00pm", available: true, booked: false },
      { slot: "Wed-12:15pm", available: true, booked: false },
      { slot: "Wed-12:30pm", available: true, booked: false },
      { slot: "Wed-12:45pm", available: true, booked: false },
      { slot: "Wed-1:00pm", available: true, booked: false },
      { slot: "Wed-1:15pm", available: true, booked: false },
      { slot: "Wed-1:30pm", available: true, booked: false },
      { slot: "Wed-1:45pm", available: true, booked: false },
      { slot: "Wed-2:00pm", available: true, booked: false },
      { slot: "Wed-2:15pm", available: true, booked: false },
      { slot: "Wed-2:30pm", available: true, booked: false },
      { slot: "Wed-2:45pm", available: true, booked: false },
      { slot: "Wed-3:00pm", available: true, booked: false },
      { slot: "Wed-3:15pm", available: true, booked: false },
      { slot: "Wed-3:30pm", available: true, booked: false },
      { slot: "Wed-3:45pm", available: true, booked: false },
      { slot: "Wed-4:00pm", available: true, booked: false },
      { slot: "Wed-4:15pm", available: true, booked: false },
      { slot: "Wed-4:30pm", available: true, booked: false },
      { slot: "Wed-4:45pm", available: true, booked: false },
      { slot: "Wed-5:00pm", available: true, booked: false },
      { slot: "Wed-5:15pm", available: true, booked: false },
      { slot: "Wed-5:30pm", available: true, booked: false },
      { slot: "Wed-5:45pm", available: true, booked: false },
      { slot: "Wed-6:00pm", available: true, booked: false },
      { slot: "Wed-6:15pm", available: true, booked: false },
      { slot: "Wed-6:30pm", available: true, booked: false },
      { slot: "Wed-6:45pm", available: true, booked: false },
      { slot: "Wed-7:00pm", available: true, booked: false },
      { slot: "Wed-7:15pm", available: true, booked: false },
      { slot: "Wed-7:30pm", available: true, booked: false },
      { slot: "Wed-7:45pm", available: true, booked: false },
      { slot: "Thu-9:00am", available: true, booked: false },
      { slot: "Thu-9:15am", available: true, booked: false },
      { slot: "Thu-9:30am", available: true, booked: false },
      { slot: "Thu-9:45am", available: true, booked: false },
      { slot: "Thu-10:00am", available: true, booked: false },
      { slot: "Thu-10:15am", available: true, booked: false },
      { slot: "Thu-10:30am", available: true, booked: false },
      { slot: "Thu-10:45am", available: true, booked: false },
      { slot: "Thu-11:00am", available: true, booked: false },
      { slot: "Thu-11:15am", available: true, booked: false },
      { slot: "Thu-11:30am", available: true, booked: false },
      { slot: "Thu-11:45am", available: true, booked: false },
      { slot: "Thu-12:00pm", available: true, booked: false },
      { slot: "Thu-12:15pm", available: true, booked: false },
      { slot: "Thu-12:30pm", available: true, booked: false },
      { slot: "Thu-12:45pm", available: true, booked: false },
      { slot: "Thu-1:00pm", available: true, booked: false },
      { slot: "Thu-1:15pm", available: true, booked: false },
      { slot: "Thu-1:30pm", available: true, booked: false },
      { slot: "Thu-1:45pm", available: true, booked: false },
      { slot: "Thu-2:00pm", available: true, booked: false },
      { slot: "Thu-2:15pm", available: true, booked: false },
      { slot: "Thu-2:30pm", available: true, booked: false },
      { slot: "Thu-2:45pm", available: true, booked: false },
      { slot: "Thu-3:00pm", available: true, booked: false },
      { slot: "Thu-3:15pm", available: true, booked: false },
      { slot: "Thu-3:30pm", available: true, booked: false },
      { slot: "Thu-3:45pm", available: true, booked: false },
      { slot: "Thu-4:00pm", available: true, booked: false },
      { slot: "Thu-4:15pm", available: true, booked: false },
      { slot: "Thu-4:30pm", available: true, booked: false },
      { slot: "Thu-4:45pm", available: true, booked: false },
      { slot: "Thu-5:00pm", available: true, booked: false },
      { slot: "Thu-5:15pm", available: true, booked: false },
      { slot: "Thu-5:30pm", available: true, booked: false },
      { slot: "Thu-5:45pm", available: true, booked: false },
      { slot: "Thu-6:00pm", available: true, booked: false },
      { slot: "Thu-6:15pm", available: true, booked: false },
      { slot: "Thu-6:30pm", available: true, booked: false },
      { slot: "Thu-6:45pm", available: true, booked: false },
      { slot: "Thu-7:00pm", available: true, booked: false },
      { slot: "Thu-7:15pm", available: true, booked: false },
      { slot: "Thu-7:30pm", available: true, booked: false },
      { slot: "Thu-7:45pm", available: true, booked: false },
      { slot: "Fri-9:00am", available: true, booked: false },
      { slot: "Fri-9:15am", available: true, booked: false },
      { slot: "Fri-9:30am", available: true, booked: false },
      { slot: "Fri-9:45am", available: true, booked: false },
      { slot: "Fri-10:00am", available: true, booked: false },
      { slot: "Fri-10:15am", available: true, booked: false },
      { slot: "Fri-10:30am", available: true, booked: false },
      { slot: "Fri-10:45am", available: true, booked: false },
      { slot: "Fri-11:00am", available: true, booked: false },
      { slot: "Fri-11:15am", available: true, booked: false },
      { slot: "Fri-11:30am", available: true, booked: false },
      { slot: "Fri-11:45am", available: true, booked: false },
      { slot: "Fri-12:00pm", available: true, booked: false },
      { slot: "Fri-12:15pm", available: true, booked: false },
      { slot: "Fri-12:30pm", available: true, booked: false },
      { slot: "Fri-12:45pm", available: true, booked: false },
      { slot: "Fri-1:00pm", available: true, booked: false },
      { slot: "Fri-1:15pm", available: true, booked: false },
      { slot: "Fri-1:30pm", available: true, booked: false },
      { slot: "Fri-1:45pm", available: true, booked: false },
      { slot: "Fri-2:00pm", available: true, booked: false },
      { slot: "Fri-2:15pm", available: true, booked: false },
      { slot: "Fri-2:30pm", available: true, booked: false },
      { slot: "Fri-2:45pm", available: true, booked: false },
      { slot: "Fri-3:00pm", available: true, booked: false },
      { slot: "Fri-3:15pm", available: true, booked: false },
      { slot: "Fri-3:30pm", available: true, booked: false },
      { slot: "Fri-3:45pm", available: true, booked: false },
      { slot: "Fri-4:00pm", available: true, booked: false },
      { slot: "Fri-4:15pm", available: true, booked: false },
      { slot: "Fri-4:30pm", available: true, booked: false },
      { slot: "Fri-4:45pm", available: true, booked: false },
      { slot: "Fri-5:00pm", available: true, booked: false },
      { slot: "Fri-5:15pm", available: true, booked: false },
      { slot: "Fri-5:30pm", available: true, booked: false },
      { slot: "Fri-5:45pm", available: true, booked: false },
      { slot: "Fri-6:00pm", available: true, booked: false },
      { slot: "Fri-6:15pm", available: true, booked: false },
      { slot: "Fri-6:30pm", available: true, booked: false },
      { slot: "Fri-6:45pm", available: true, booked: false },
      { slot: "Fri-7:00pm", available: true, booked: false },
      { slot: "Fri-7:15pm", available: true, booked: false },
      { slot: "Fri-7:30pm", available: true, booked: false },
      { slot: "Fri-7:45pm", available: true, booked: false },
      { slot: "Sat-9:00am", available: true, booked: false },
      { slot: "Sat-9:15am", available: true, booked: false },
      { slot: "Sat-9:30am", available: true, booked: false },
      { slot: "Sat-9:45am", available: true, booked: false },
      { slot: "Sat-10:00am", available: true, booked: false },
      { slot: "Sat-10:15am", available: true, booked: false },
      { slot: "Sat-10:30am", available: true, booked: false },
      { slot: "Sat-10:45am", available: true, booked: false },
      { slot: "Sat-11:00am", available: true, booked: false },
      { slot: "Sat-11:15am", available: true, booked: false },
      { slot: "Sat-11:30am", available: true, booked: false },
      { slot: "Sat-11:45am", available: true, booked: false },
      { slot: "Sat-12:00pm", available: true, booked: false },
      { slot: "Sat-12:15pm", available: true, booked: false },
      { slot: "Sat-12:30pm", available: true, booked: false },
      { slot: "Sat-12:45pm", available: true, booked: false },
      { slot: "Sat-1:00pm", available: true, booked: false },
      { slot: "Sat-1:15pm", available: true, booked: false },
      { slot: "Sat-1:30pm", available: true, booked: false },
      { slot: "Sat-1:45pm", available: true, booked: false },
      { slot: "Sat-2:00pm", available: true, booked: false },
      { slot: "Sat-2:15pm", available: true, booked: false },
      { slot: "Sat-2:30pm", available: true, booked: false },
      { slot: "Sat-2:45pm", available: true, booked: false },
      { slot: "Sat-3:00pm", available: true, booked: false },
      { slot: "Sat-3:15pm", available: true, booked: false },
      { slot: "Sat-3:30pm", available: true, booked: false },
      { slot: "Sat-3:45pm", available: true, booked: false },
      { slot: "Sat-4:00pm", available: true, booked: false },
      { slot: "Sat-4:15pm", available: true, booked: false },
      { slot: "Sat-4:30pm", available: true, booked: false },
      { slot: "Sat-4:45pm", available: true, booked: false },
      { slot: "Sat-5:00pm", available: true, booked: false },
      { slot: "Sat-5:15pm", available: true, booked: false },
      { slot: "Sat-5:30pm", available: true, booked: false },
      { slot: "Sat-5:45pm", available: true, booked: false },
      { slot: "Sat-6:00pm", available: true, booked: false },
      { slot: "Sat-6:15pm", available: true, booked: false },
      { slot: "Sat-6:30pm", available: true, booked: false },
      { slot: "Sat-6:45pm", available: true, booked: false },
      { slot: "Sat-7:00pm", available: true, booked: false },
      { slot: "Sat-7:15pm", available: true, booked: false },
      { slot: "Sat-7:30pm", available: true, booked: false },
      { slot: "Sat-7:45pm", available: true, booked: false },
      { slot: "Sun-9:00am", available: true, booked: false },
      { slot: "Sun-9:15am", available: true, booked: false },
      { slot: "Sun-9:30am", available: true, booked: false },
      { slot: "Sun-9:45am", available: true, booked: false },
      { slot: "Sun-10:00am", available: true, booked: false },
      { slot: "Sun-10:15am", available: true, booked: false },
      { slot: "Sun-10:30am", available: true, booked: false },
      { slot: "Sun-10:45am", available: true, booked: false },
      { slot: "Sun-11:00am", available: true, booked: false },
      { slot: "Sun-11:15am", available: true, booked: false },
      { slot: "Sun-11:30am", available: true, booked: false },
      { slot: "Sun-11:45am", available: true, booked: false },
      { slot: "Sun-12:00pm", available: true, booked: false },
      { slot: "Sun-12:15pm", available: true, booked: false },
      { slot: "Sun-12:30pm", available: true, booked: false },
      { slot: "Sun-12:45pm", available: true, booked: false },
      { slot: "Sun-1:00pm", available: true, booked: false },
      { slot: "Sun-1:15pm", available: true, booked: false },
      { slot: "Sun-1:30pm", available: true, booked: false },
      { slot: "Sun-1:45pm", available: true, booked: false },
      { slot: "Sun-2:00pm", available: true, booked: false },
      { slot: "Sun-2:15pm", available: true, booked: false },
      { slot: "Sun-2:30pm", available: true, booked: false },
      { slot: "Sun-2:45pm", available: true, booked: false },
      { slot: "Sun-3:00pm", available: true, booked: false },
      { slot: "Sun-3:15pm", available: true, booked: false },
      { slot: "Sun-3:30pm", available: true, booked: false },
      { slot: "Sun-3:45pm", available: true, booked: false },
      { slot: "Sun-4:00pm", available: true, booked: false },
      { slot: "Sun-4:15pm", available: true, booked: false },
      { slot: "Sun-4:30pm", available: true, booked: false },
      { slot: "Sun-4:45pm", available: true, booked: false },
      { slot: "Sun-5:00pm", available: true, booked: false },
      { slot: "Sun-5:15pm", available: true, booked: false },
      { slot: "Sun-5:30pm", available: true, booked: false },
      { slot: "Sun-5:45pm", available: true, booked: false },
      { slot: "Sun-6:00pm", available: true, booked: false },
      { slot: "Sun-6:15pm", available: true, booked: false },
      { slot: "Sun-6:30pm", available: true, booked: false },
      { slot: "Sun-6:45pm", available: true, booked: false },
      { slot: "Sun-7:00pm", available: true, booked: false },
      { slot: "Sun-7:15pm", available: true, booked: false },
      { slot: "Sun-7:30pm", available: true, booked: false },
      { slot: "Sun-7:45pm", available: true, booked: false },
    ],
  },
];

const dailyAvailability = [
  {
    slot: "9:00am",
    available: false,
  },
  {
    slot: "9:15am",
    available: false,
  },
  {
    slot: "9:30am",
    available: false,
  },
  {
    slot: "9:45am",
    available: false,
  },
  {
    slot: "10:00am",
    available: true,
  },
  {
    slot: "10:15am",
    available: true,
  },
  {
    slot: "10:30am",
    available: true,
  },
  {
    slot: "10:45am",
    available: true,
  },
  {
    slot: "11:00am",
    available: true,
  },
  {
    slot: "11:15am",
    available: true,
  },
  {
    slot: "11:30am",
    available: true,
  },
  {
    slot: "11:45am",
    available: true,
  },
  {
    slot: "12:00pm",
    available: true,
  },
  {
    slot: "12:15pm",
    available: true,
  },
  {
    slot: "12:30pm",
    available: true,
  },
  {
    slot: "12:45pm",
    available: true,
  },
  {
    slot: "1:00pm",
    available: true,
  },
  {
    slot: "1:15pm",
    available: true,
  },
  {
    slot: "1:30pm",
    available: true,
  },
  {
    slot: "1:45pm",
    available: true,
  },
  {
    slot: "2:00pm",
    available: true,
  },
  {
    slot: "2:15pm",
    available: true,
  },
  {
    slot: "2:30pm",
    available: true,
  },
  {
    slot: "2:45pm",
    available: true,
  },
  {
    slot: "3:00pm",
    available: true,
  },
  {
    slot: "3:15pm",
    available: true,
  },
  {
    slot: "3:30pm",
    available: true,
  },
  {
    slot: "3:45pm",
    available: true,
  },
  {
    slot: "4:00pm",
    available: true,
  },
  {
    slot: "4:15pm",
    available: true,
  },
  {
    slot: "4:30pm",
    available: true,
  },
  {
    slot: "4:45pm",
    available: true,
  },
  {
    slot: "5:00pm",
    available: true,
  },
  {
    slot: "5:15pm",
    available: true,
  },
  {
    slot: "5:30pm",
    available: true,
  },
  {
    slot: "5:45pm",
    available: true,
  },
  {
    slot: "6:00pm",
    available: true,
  },
  {
    slot: "6:15pm",
    available: true,
  },
  {
    slot: "6:30pm",
    available: true,
  },
  {
    slot: "6:45pm",
    available: true,
  },
  {
    slot: "7:00pm",
    available: true,
  },
  {
    slot: "7:15pm",
    available: true,
  },
  {
    slot: "7:30pm",
    available: true,
  },
  {
    slot: "7:45pm",
    available: true,
  },
];

const services = [
  { _id: "01", name: "coupe femme", price: "30$", duration: "2" },
  { _id: "02", name: "coupe et lavage", price: "30$", duration: "2" },
  { _id: "03", name: "coupe homme", price: "25$", duration: "2" },
  { _id: "04", name: "combo coupe et barbe", price: "40$-50$", duration: "2" },
  { _id: "05", name: "age d'or", price: "22$", duration: "1" },
  { _id: "06", name: "coupe enfant", price: "25$", duration: "1" },
  {
    _id: "07",
    name: "barbe avec tendeuse ou lame",
    price: "20$",
    duration: "1",
  },
  {
    _id: "08",
    name: "barbe avec serviette chaude",
    price: "25$",
    duration: "1",
  },
];
const doc = [
  {
    _id: "about",
    content:
      "Step through our doors and discover the magic of timeless style, impeccable service, and an unforgettable grooming experience. We can't wait to welcome you into our chair! Your satisfaction is our top priority, and we look forward to exceeding your expectations every time you visit.",
  },
];
const batchImport = async (data) => {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("HollywoodBarberShop");
    const result = await db
      .collection("admin")
      .updateOne(
        { _id: "44e8be60-485b-4e79-aa4b-dc59d65d43b5" },
        { $set: { dailyAvailability: data } }
      );
    if (result.acknowledged) {
      console.log("Success");
    } else {
      console.log("Failed");
    }
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
};

// batchImport(dailyAvailability);
module.exports = { dailyAvailability };
