import React, { useState } from 'react'
import './Calendar.css'

const Calendar = () => {
    const daysOfWeek = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
    const monthsOfYear = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    const currentDate = new Date();
    const[currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const[currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const[selectedDate, setSelectedDate] = useState(currentDate);
    const[showEventPopup, setShowEventPopup] = useState(false);

    const[events, setEvents] = useState([]);
    const[eventDays, setEventDays] = useState({day1 : '00', day2 : '00'});
    const[eventText, setEventText] = useState('Arendamento Strelicia');    

    const daysInMonth = new Date(currentYear,currentMonth + 1,0).getDate();
    const firstDayOfMonth = new Date(currentYear,currentMonth,1).getDay() ;
    
    const prevMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1) )
        setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear))
    }

    const nextMonth = () => {
        setCurrentMonth((nextMonth) => (nextMonth === 11 ? 0 : nextMonth + 1))
        setCurrentYear((nextYear) => (currentMonth === 11 ? nextYear + 1 : nextYear))
    }

    const handleDayClick = (day) =>{
        const clickDate = new Date(currentYear, currentMonth, day);
        const today = new Date();

        if(clickDate >= today || isSameDay(clickDate, today)){
            setSelectedDate(clickDate);
            setShowEventPopup(true);
            setEventText("Arendamento Strelicia");
            setEventDays({day1 : clickDate.getDay(),day2 : '00'});
        }
    }

    const isSameDay = (date1, date2) => {
        return(
            date1.getFullYear() === date2.getFullYear() && 
            date1.getMonth() === date2.getMonth() &&
            date1.getDay() === date2.getDay()
        )
    }

    const handleEventSubmit = () => {
        const newEvent = {
            date: selectedDate,
            time: `${eventDays.day1.padStart(2,'0')}:${eventDays.day2.padStart(2,'0')}`,
            text: eventText,
        }

        setEvents([...events, newEvent])
        setEventDays({day1 : selectedDate.getDay(), day2 : '00'})
        setEventText("Arendamento Strelicia")
        setShowEventPopup(false)
    }

  return (
    <div className='background'>
    <div className='container'>
        <div className='calender-app'>
            <div className='calendar'>
                <h1 className='heading'>Calendar</h1>

                <div className='navigate-date'>
                    <h2 className='month'>{monthsOfYear[currentMonth]}</h2>
                    <h2 className='year'>{currentYear}</h2>
                    <div className='buttons'>
                        <i class="fa fa-arrow-left" onClick={prevMonth}></i>
                        <i class="fa fa-arrow-right" onClick={nextMonth}></i>
                    </div>
                </div>
                <div className='weekdays'>
                    {daysOfWeek.map((day) => <span key={day}>{day}</span>)}
                </div>
                <div className='days'>
                    {[...Array(firstDayOfMonth !== 0 ? (firstDayOfMonth-1) : (firstDayOfMonth+6) ).keys()].map((_,index) => 
                        (<span key={`empty-${index}`}/>))}

                    {[...Array(daysInMonth).keys()].map((day) =>
                         (<span key={day + 1} className={day +1 === currentDate.getDate() 
                         && currentMonth === currentDate.getMonth() 
                         && currentYear === currentDate.getFullYear() ? 'current-date' : ''}
                            onClick={() => handleDayClick(day + 1)}
                         >
                            {day + 1}</span>))}
                </div>
            </div>
            <div className='events'>
                {showEventPopup && 
                <div className='event-popup'>
                    <div className='time-input'>
                        <div className='event-popup-time'>Dias</div>
                        <input type='number' name='day1' min={1} max={31} className='day1' value={eventDays.day1} onChange={(e) => setEventDays({...eventDays, day1 : e.target.value })}/>
                        <input type='number' name='day2' min={1} max={31} className='day2' value={eventDays.day2} onChange={(e) => setEventDays({...eventDays, day2 : e.target.value })}/>
                    </div>
                    <button className='event-popup-btn' onClick={handleEventSubmit}>Arrendar</button>
                    <button className='close-event-popup'><i class="fa-solid fa-x" onClick={() => setShowEventPopup(false)}></i></button>
                </div>
                }

                {events.map((event, index) => (
                    <div className='event' key={index}>
                    <div className='event-date-wrapper'>
                        <div className='event-date'>{`${monthsOfYear[event.date.getMonth()]} ${event.date.getDate()}, ${event.date.getFullYear()}`}</div>
                        <div className='event-time'>15:00</div>
                    </div>
                    <div className='event-text'>Arrendar a Strelicia</div>
                    <div className='event-buttons'>
                       <i class="fa-solid fa-x"></i>
                    </div>
                </div>
                )
                )}
            </div>
        </div>
    </div>
    </div>
  )
}

export default Calendar
