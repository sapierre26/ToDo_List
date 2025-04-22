import React, { useState, useEffect } from 'react';
import {Calendar, dateFnsLocalizer} from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Datepicker from 'react-datepicker';
import './calendar.css';

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

// custom toolbar
const MyCustomToolbar = ({ label, onNavigate, onView }) => {
//custom toolbar and props are date, onNavigate, and onView
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    let curr = startDate.getDate();
    if (curr < 10) {
        curr = '0' + curr;
    }
    let date = curr + ' ' + label;
    const newDate = parse(date, 'dd MMMM yyyy', new Date());

    if (!isNaN(newDate.getTime())) { // Check if the date is valid
        setStartDate(newDate);
    }
  }, [label]);

  const handleDateChange = (date) => {
    setStartDate(date);
    onNavigate("DATE", date); // Moves the calendar view to the selected date
  };

  const handleTodayClick = () => {
    const today = new Date();
    setStartDate(today);
    onNavigate("TODAY"); // Navigate calendar to today
  };

  return (
    <div style={{ display: "flex", paddingBottom: "1rem" }}>
      <div
        className="calendar-nav"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <button onClick={() => onNavigate("PREV")}>←</button>
        <button onClick={handleTodayClick}>Today</button>
        <button onClick={() => onNavigate("NEXT")}>→</button>
      </div>

      <div className="calendar-view">
        <button onClick={() => onView("month")}>Month</button>
      </div>
    </div>
  );
};

// actual calendar component
const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events"));
    if (savedEvents) setEvents(savedEvents);
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const handleEvents = ({ start, end }) => {
    const title = window.prompt("Event Title: ");
    if (title) {
      const newEvent = { title, start, end, allDay: true };
      setEvents([...events, newEvent]);
    }
  };

  const handleDeleteEvent = (event) => {
    if (window.confirm(`Delete '${event.title}'?`)) {
      setEvents(events.filter((e) => e !== event));
    }
  };

  return (
    <div className="calendar-container" style={{ height: '100%' }}>
      <Calendar
        components={{
          toolbar: MyCustomToolbar,
        }}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="day"
	views={['day']}
        selectable
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fff",
          fontFamily: "inherit",
          width: 1350,
        }}
      />
      {/* <AddTask /> */}
    </div>
  );
};

const RightSide = () => {
	return (
		<div style={{ 
			flex: 1, 
			backgroundColor: '#ffffff', 
			padding: '20px',
			borderSizing: 'border-box',
			overflow: 'hidden'
		}}>
			<CalendarComponent />
		</div>
	);
};

export default RightSide;
