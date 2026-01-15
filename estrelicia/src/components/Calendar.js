import React, { useState } from 'react'
import './Calendar.css'

const Calendar = () => {
  const monthsOfYear = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const current = new Date();

  const [month, setMonth] = useState(current.getMonth());
  const [year, setYear] = useState(current.getFullYear());

  const [range, setRange] = useState({ start: null, end: null });
  const [bookings, setBookings] = useState([]);

  //temp
  const [blockedDates] = useState([
    new Date(year, month, 20),
    new Date(year, month, 21),
    new Date(year, month, 22),
  ]);
  //temp

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  const isToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date.toDateString() === today.toDateString();
  };

  const isBlocked = (d) => blockedDates.some(b => b.toDateString() === d.toDateString());

  const hasBlockedBetween = (start, end) => {
    return blockedDates.some(d => d > start && d < end);
  };

const isPast = (date) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  return date < today;
};

  const handleClick = (day) => {
  const clicked = new Date(year, month, day);

  if (isBlocked(clicked)) return;

  if (range.start && !range.end &&
      range.start.toDateString() === clicked.toDateString()) {
    setRange({ start: null, end: null });
    return;
  }

  if (!range.start) {
    setRange({ start: clicked, end: null });
    return;
  }

  if (range.start && !range.end) {
    if (clicked <= range.start) {
      setRange({ start: clicked, end: null });
      return;
    }

    if (hasBlockedBetween(range.start, clicked)) {
      return;
    }

    setRange(prev => ({ ...prev, end: clicked }));
    return;
  }
  setRange({ start: clicked, end: null });
};


  const saveBooking = () => {
    if (!range.start || !range.end) return;

    const newBooking = { start: range.start, end: range.end };
    setBookings(prev => [...prev, newBooking]);
    setRange({ start: null, end: null });
  };

  const removeBooking = (i) => {
    setBookings(prev => prev.filter((_, idx) => idx !== i));
  };

  const inRange = (d) => {
    if (!range.start || !range.end) return false;
    return d > range.start && d < range.end;
  };

  const prevMonth = () => {
    setMonth(m => (m === 0 ? 11 : m - 1));
    setYear(y => (month === 0 ? y - 1 : y));
  };

  const nextMonth = () => {
    setMonth(m => (m === 11 ? 0 : m + 1));
    setYear(y => (month === 11 ? y + 1 : y));
  };

  return (
    <div className="background">
      <div className="container">
        <div className="calender-app">
          <div className="calendar">
            <h1 className="heading">Calendar</h1>

            <div className="navigate-date">
              <h2 className="month">{monthsOfYear[month]}</h2>
              <h2 className="year">{year}</h2>
              <div className="buttons">
                <i className="fa fa-arrow-left" onClick={prevMonth}></i>
                <i className="fa fa-arrow-right" onClick={nextMonth}></i>
              </div>
            </div>

            <div className="days">
              {[...Array((firstWeekday + 6) % 7).keys()].map(i => (
                <span key={"e"+i}></span>
              ))}

              {[...Array(daysInMonth).keys()].map(i => {
                const day = i + 1;
                const d = new Date(year, month, day);

                const classes = [];
                  if (isToday(d)) classes.push("today");

                  if (isPast(d)) classes.push("past");

                  if (isBlocked(d)) classes.push("blocked");

                  if (range.start?.toDateString() === d.toDateString())
                    classes.push("selected-start");

                  if (range.end?.toDateString() === d.toDateString())
                    classes.push("selected-end");

                  if (inRange(d))
                    classes.push("selected-range");


                return (
                  <span key={day} className={classes.join(" ")} onClick={() => handleClick(day)}>
                    {day}
                  </span>
                );
              })}
            </div>

            {range.start && range.end && (
              <button className="event-popup-btn mt-4" onClick={saveBooking}>
                Confirmar
              </button>
            )}
          </div>

          <div className="events">
            <h2 className="heading text-xl mb-4">Current Bookings</h2>
            {bookings.map((b, i) => (
              <div className="event flex justify-between items-center" key={i}>
                <div className="event-text">
                  {b.start.toLocaleDateString()} → {b.end.toLocaleDateString()}
                </div>
                <button onClick={() => removeBooking(i)} className="event-popup-btn">Remover</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
