require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { createEvents } = require("ics");
const fetch = require("node-fetch");
const ical = require("ical");
const multer = require("multer");
const subscribersPath = path.join(__dirname, "subscribers.json");
const settingsPath = path.join(__dirname, "settings.json");
let cachedBlockedDates = [];
let lastBlockedFetch = 0;


const CACHE_DURATION = 15 * 60 * 1000; 

const AIRBNB_ICAL_URL = process.env.AIRBNB_ICAL_URL;


const app = express();
const PORT = process.env.PORT || 3001;

const BOOKINGS_FILE = path.join(__dirname, "bookings.json");
console.log("AIRBNB_ICAL_URL:", process.env.AIRBNB_ICAL_URL);

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "uploads")));

function authenticateAdmin(req, res, next) {
  const adminPassword = req.headers["x-admin-password"];

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}


const readBookings = () => {
  const data = fs.readFileSync(BOOKINGS_FILE, "utf-8");
  return JSON.parse(data);
};


const writeBookings = (bookings) => {
  fs.writeFileSync(
    BOOKINGS_FILE,
    JSON.stringify(bookings, null, 2)
  );
};


app.post("/bookings", async (req, res) => {
  const { start, end } = req.body;

  if (!start || !end) {
    return res.status(400).json({ error: "Missing start or end date" });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate) || isNaN(endDate)) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  const nights =
    (endDate - startDate) / (1000 * 60 * 60 * 24);

  if (nights < 2) {
    return res.status(400).json({
      error: "Minimum stay is 2 nights"
    });
  }

  const bookings = readBookings();

  const isOverlapping = bookings.some((booking) => {
    const existingStart = new Date(booking.start);
    const existingEnd = new Date(booking.end);

    return (
      startDate < existingEnd &&
      endDate > existingStart
    );
  });

  if (isOverlapping) {
    return res.status(400).json({
      error: "Dates overlap with existing booking"
    });
  }

  const airbnbBlocked = await fetchAirbnbBlockedDates();

  for (
    let d = new Date(startDate);
    d < endDate;
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = d.toISOString().split("T")[0];

    if (airbnbBlocked.includes(dateStr)) {
      return res.status(400).json({
        error: "Dates include Airbnb blocked days"
      });
    }
  }

  bookings.push({ start, end });
  writeBookings(bookings);

  lastBlockedFetch = 0;

  res.status(201).json({ success: true });
});

app.get("/bookings", (req, res) => {
  const bookings = readBookings();
  res.json(bookings);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

const bookingsToICalEvents = (bookings) => {
  return bookings.map((booking) => {
    const startDate = new Date(booking.start);
    const endDate = new Date(booking.end);

    return {
      title: "House booked",
      start: [
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate()
      ],
      end: [
        endDate.getFullYear(),
        endDate.getMonth() + 1,
        endDate.getDate()
      ],
      busyStatus: "BUSY"
    };
  });
};

app.get("/calendar.ics", (req, res) => {
  const bookings = readBookings();
  const events = bookingsToICalEvents(bookings);

  createEvents(events, (error, value) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Error generating calendar");
    }

    res.setHeader("Content-Type", "text/calendar");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=calendar.ics"
    );
    res.send(value);
  });
});


const fetchAirbnbBlockedDates = async () => {
  if (!AIRBNB_ICAL_URL) return [];

  const response = await fetch(AIRBNB_ICAL_URL);
  const icsText = await response.text();

  const blockedDates = [];

  const events = icsText.split("BEGIN:VEVENT");

  for (const event of events) {
    if (!event.includes("DTSTART")) continue;

    const startMatch = event.match(/DTSTART(?:;VALUE=DATE)?:(\d{8})/);
    const endMatch = event.match(/DTEND(?:;VALUE=DATE)?:(\d{8})/);

    if (!startMatch || !endMatch) continue;

    const parseDate = (str) =>
      new Date(Date.UTC(
        parseInt(str.slice(0, 4)),
        parseInt(str.slice(4, 6)) - 1,
        parseInt(str.slice(6, 8))
      ));

    const start = parseDate(startMatch[1]);
    const end = parseDate(endMatch[1]);

    for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
      blockedDates.push(d.toISOString().split("T")[0]);
    }
  }

  return blockedDates;
}

const getLocalBlockedDates = () => {
  const bookings = readBookings();
  const dates = [];

  bookings.forEach(({ start, end }) => {
    let d = new Date(start);
    const endDate = new Date(end);

    while (d < endDate) {
      dates.push(d.toISOString().split("T")[0]);

      // ✅ USE UTC VERSION
      d.setUTCDate(d.getUTCDate() + 1);
    }
  });

  return dates;
};
app.get("/blocked-dates", async (req, res) => {
  try {
    const now = Date.now();

    if (now - lastBlockedFetch < CACHE_DURATION) {
      return res.json(cachedBlockedDates);
    }

    console.log("Refreshing blocked dates cache...");

    const local = getLocalBlockedDates();
    const airbnb = await fetchAirbnbBlockedDates();

    const merged = Array.from(new Set([...local, ...airbnb]));

    cachedBlockedDates = merged;
    lastBlockedFetch = now;

    res.json(merged);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load blocked dates" });
  }
});

const uploadFolder = path.join(__dirname, "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
  const allowedNames = [
    "Img1.png",
    "Img2.jpg",
    "Img3.jpg",
    "Img4.jpg",
    "Img5.jpg",
    "Img6.png",
    "popup.jpg",
    "video-1.mp4"
  ];

  const targetName = req.params.targetName;

  console.log("Received targetName:", targetName);

  if (!allowedNames.includes(targetName)) {
    return cb(new Error("Invalid file name"));
  }

  cb(null, targetName);
}});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "video/mp4"];

  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error("Only PNG, JPG and MP4 allowed"));
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter
});


app.post(
  "/admin/upload/:targetName",

  (req, res, next) => {
    const adminPassword = req.headers["x-admin-password"];

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    next(); 
  },

  upload.single("image"),

  (req, res) => {
    res.json({ success: true, message: "Image replaced successfully" });
  }
);

app.post("/admin/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password required" });
  }

  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true });
  }

  return res.status(401).json({ error: "Invalid password" });
});


app.post("/subscribe", express.json(), (req, res) => {
  const { email } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Por favor forneça um email valido" });
  }

  const subscribers = JSON.parse(fs.readFileSync(subscribersPath));

  if (subscribers.includes(email)) {
    return res.status(400).json({ message: "Email ja foi utilizado" });
  }

  subscribers.push(email);

  fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));

  res.json({ message: "Sucesso" });
});

app.get("/settings", (req, res) => {
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath));
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to read settings" });
  }
});

app.post("/admin/update-price", authenticateAdmin, (req, res) => {
  const { price } = req.body;

  if (!price || isNaN(price)) {
    return res.status(400).json({ error: "Preço inválido" });
  }

  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath));

    settings.pricePerNight = Number(price);

    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

    res.json({ message: "Price updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update price" });
  }
});

app.post("/admin/update-weekend-price", authenticateAdmin, (req, res) => {
  const { priceWeekend } = req.body;

  if (!priceWeekend || isNaN(priceWeekend)) {
    return res.status(400).json({ error: "Preço inválido" });
  }

  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath));

    settings.priceWeekend = Number(priceWeekend);

    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

    res.json({ message: "Weekend price updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update weekend price" });
  }
});

app.post("/admin/update-popup", authenticateAdmin, (req, res) => {
  const { enabled } = req.body;

  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath));

    settings.popup.enabled = enabled;

    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

    res.json({ message: "Popup updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update popup" });
  }
});

app.post("/admin/update-show-price", authenticateAdmin, (req, res) => {
  const { showPrice } = req.body;

  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath));

    settings.showPrice = showPrice;

    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

    res.json({ message: "Show price setting updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update setting" });
  }
});

app.get("/admin/download-subscribers", authenticateAdmin, (req, res) => {
  try {
    const subscribers = JSON.parse(fs.readFileSync(subscribersPath));

    const content = subscribers.join("\n");

    res.setHeader("Content-Type", "text/plain");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=subscribers.txt"
    );

    res.send(content);
  } catch (err) {
    res.status(500).json({ error: "Failed to download subscribers" });
  }
});

app.post("/admin/update-extra-guest-price", authenticateAdmin, (req, res) => {
  const { extraGuestPrice } = req.body;

  if (!extraGuestPrice || isNaN(extraGuestPrice)) {
    return res.status(400).json({ error: "Preço inválido" });
  }

  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath));

    settings.extraGuestPrice = Number(extraGuestPrice);

    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

    res.json({ message: "Extra guest price updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update extra guest price" });
  }
});