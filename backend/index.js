require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { createEvents } = require("ics");
const fetch = require("node-fetch");
const ical = require("ical");

const AIRBNB_ICAL_URL = process.env.AIRBNB_ICAL_URL;


const app = express();
const PORT = process.env.PORT || 3001;

const BOOKINGS_FILE = path.join(__dirname, "bookings.json");
console.log("AIRBNB_ICAL_URL:", process.env.AIRBNB_ICAL_URL);

app.use(cors());
app.use(express.json());


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


app.post("/bookings", (req, res) => {
  const { start, end } = req.body;

  if (!start || !end) {
    return res.status(400).json({ error: "Missing start or end date" });
  }

  const bookings = readBookings();

  bookings.push({ start, end });

  writeBookings(bookings);

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

  const data = ical.parseICS(icsText);

  const blockedDates = [];

  for (const key in data) {
    const event = data[key];

    if (event.type === "VEVENT") {
      const start = new Date(event.start);
      const end = new Date(event.end);

      for (
        let d = new Date(start);
        d < end;
        d.setDate(d.getDate() + 1)
      ) {
        blockedDates.push(d.toISOString().split("T")[0]);
      }
    }
  }

  return blockedDates;
};

const getLocalBlockedDates = () => {
  const bookings = readBookings();
  const dates = [];

  bookings.forEach(({ start, end }) => {
    let d = new Date(start);
    const endDate = new Date(end);

    while (d < endDate) {
      dates.push(d.toISOString().split("T")[0]);
      d.setDate(d.getDate() + 1);
    }
  });

  return dates;
};

app.get("/blocked-dates", async (req, res) => {
  try {
    const local = getLocalBlockedDates();
    const airbnb = await fetchAirbnbBlockedDates();

    const merged = Array.from(new Set([...local, ...airbnb]));

    res.json(merged);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load blocked dates" });
  }
});
