import React, { useState, useEffect } from 'react'
import './Calendar.css'

const Calendar = () => {
  const monthsOfYear = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const current = new Date();
  const MIN_NIGHTS = 2;


  const [month, setMonth] = useState(current.getMonth());
  const [year, setYear] = useState(current.getFullYear());

  const [range, setRange] = useState({ start: null, end: null });

  const [showContactPopup, setShowContactPopup] = useState(false);

  const [blockedDates, setBlockedDates] = useState([]);

  const [warningDate, setWarningDate] = useState(null);

  const [pricePerNight, setPricePerNight] = useState(0);
  const [showPrice, setShowPrice] = useState(true);

  const isokHour = () => {
  const now = new Date();

  const hour = now.getUTCHours(); 
  return hour >= 12;
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;

  const isToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date.toDateString() === today.toDateString();
  };

useEffect(() => {
  fetch("http://localhost:3001/settings")
    .then(res => res.json())
    .then(data => {
      setPricePerNight(data.pricePerNight);
      setShowPrice(data.showPrice);
    });
}, []);


  useEffect(() => {
  const fetchBlockedDates = async () => {
    try {
      const res = await fetch("http://localhost:3001/blocked-dates");
      const data = await res.json();

      const dates = data.map(d => {
        const [year, month, day] = d.split("-").map(Number);
        return new Date(year, month - 1, day);
      });

      setBlockedDates(dates);
    } catch (err) {
      console.error("Failed to load blocked dates", err);
    }
  };

  fetchBlockedDates();
}, []);

  const isBlocked = (date) => {
    if (blockedDates.some(d => d.toDateString() === date.toDateString())) {
      return true;
    }

    if (isokHour()) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date.toDateString() === today.toDateString();
    }

    return false;
};

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
  clicked.setHours(0,0,0,0);

  if (isBlocked(clicked) || isPast(clicked)) return;

  if (range.start && range.end) {
    setRange({ start: clicked, end: null });
    return;
  }

  if (
    range.start &&
    !range.end &&
    clicked.toDateString() === range.start.toDateString()
  ) {
    setRange({ start: null, end: null });
    return;
  }

  if (!range.start) {
    setRange({ start: clicked, end: null });
    return;
  }


  if (clicked < range.start) {
    setRange({ start: null, end: null });
    return;
  }

  if (nightsBetween(range.start, clicked) < MIN_NIGHTS) {
  setWarningDate(clicked);

  setTimeout(() => {
    setWarningDate(null);
  }, 2000);

  return;
  }

  if (hasBlockedBetween(range.start, clicked)) {
    setRange({ start: null, end: null })
    return;
  }

  setRange({ start: range.start, end: clicked });
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

  const nightsBetween = (start, end) => {
  const startUTC = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );

  const endUTC = Date.UTC(
    end.getFullYear(),
    end.getMonth(),
    end.getDate()
  );

  return Math.round((endUTC - startUTC) / (1000 * 60 * 60 * 24));
};

  const getNumberOfNights = () => {
    if (!range.start || !range.end) return 0;
    return nightsBetween(range.start, range.end);
  };

  const getTotalPrice = () => {
    return getNumberOfNights() * pricePerNight;
  };


  const buildWhatsAppMessage = () => {
  if (!range.start || !range.end) return "";

    const start = range.start.toLocaleDateString("pt-PT");
    const end = range.end.toLocaleDateString("pt-PT");
    const days = nightsBetween(range.start, range.end);

    if (!showPrice) {
      return `Olá. Gostaria de reservar a casa por ${days} noites, de ${start} a ${end}.`;
    }

    const price = pricePerNight * days;

    return `Olá. Gostaria de reservar a casa por ${days} noites, de ${start} a ${end}, pelo preço de ${price}€`;
  };

return (
  <div className="background">
    <div className="container">
      <div className="calender-app">
        <div className="calendar">
          <h1 className="heading">Calendário</h1>

          <div className="navigate-date">
            <h2 className="month">{monthsOfYear[month]}</h2>
            <h2 className="year">{year}</h2>
            <div className="buttons">
              <i className="fa fa-arrow-left" onClick={prevMonth}></i>
              <i className="fa fa-arrow-right" onClick={nextMonth}></i>
            </div>
          </div>

          <div className="weekdays">
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
              <span>Dom</span>
          </div>

          <div className="days">
          {
            [...Array(firstWeekday).keys()].map(i => (
              <span key={"e"+i}></span>))
            }

            {
              [...Array(daysInMonth).keys()].map(i => {
              const day = i + 1;
              const d = new Date(year, month, day);
              d.setHours(0,0,0,0);

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
                if (warningDate?.toDateString() === d.toDateString())
                  classes.push("warning-day");

                  return (
                    <span
                      key={day}
                      className={classes.join(" ")}
                      onClick={() => handleClick(day)}
                    >
                      {day}

                      {warningDate?.toDateString() === d.toDateString() && (
                        <div className="min-warning">
                          Mínimo 2 noites
                        </div>
                      )}
                    </span>
                  );
              }
            )
          }
          </div>

            {range.start && range.end && (
              <>
                {showPrice && (
                 <p className="prices">
                   Total é <strong>{getTotalPrice()}€</strong>{" "}
                   (<strong>{pricePerNight}€</strong> por noite ×{" "}
                   <strong>{getNumberOfNights()}</strong> noites)
                 </p>
                )}

                <button
                 className="event-popup-btn mt-4"
                 onClick={() => setShowContactPopup(true)}
                >
                  Fazer a mensagem aqui
               </button>
             </>
            )}
          </div>    
        </div>

        {showContactPopup && (
          <div className="popup-overlay" onClick={() => setShowContactPopup(false)}>
            <div className="popup" onClick={e => e.stopPropagation()}>
              <h2>Contactos</h2>
            <div className="popup-icons">
              <a
                href={`https://wa.me/351999999999?text=${encodeURIComponent(buildWhatsAppMessage())}`}
                target="_blank"
                rel="noopener noreferrer">
                <i className="fa fa-whatsapp"></i>
              </a>
              <a
                href="https://www.instagram.com/streliciahouse/"
                target="_blank"
                rel="noopener noreferrer">
                <i className="fa fa-instagram"></i>
              </a>
            </div>
            <button
        className="event-popup-btn remove-btn mt-2"
        onClick={() => setShowContactPopup(false)}>
          Close
        </button>
      </div>
      </div>
      )}
      </div>
    </div>
  );
};

export default Calendar;
