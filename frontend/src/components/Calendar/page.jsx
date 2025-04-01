import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Datepicker from "react-datepicker";
import "./calendar.css";

// Define locales for the calendar
const locales = {
  "en-US": enUS,
};

// Custom toolbar to control navigation and date selection
const MyCustomToolbar = ({ label, onNavigate, onView, date }) => {
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    // This effect will run whenever the label (current month) changes
    if (date) {
      setStartDate(date);
    }
  }, [date]);

  const handleDateChange = (date) => {
    setStartDate(date);
    onNavigate("DATE", date); // Move to the selected date in the calendar view
  };

  const handleTodayClick = () => {
    const today = new Date();
    setStartDate(today);
    onNavigate("TODAY"); // Navigate to today in the calendar
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

      <div
        className="rbc-toolbar-label"
        style={{
          alignContent: "baseline",
          flexGrow: 1,
          justifyItems: "center",
        }}
      >
        <Datepicker
          selected={startDate}
          onChange={handleDateChange}
          dateFormat="MMMM dd, yyyy"
          tabIndex={1}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          onKeyDown={(e) => e.preventDefault()}
          onFocus={(e) => e.target.blur()}
          className="custom-datepicker"
        />
      </div>

      <div className="calendar-view">
        <button onClick={() => onView("month")}>Month</button>
        <button onClick={() => onView("week")}>Week</button>
        <button onClick={() => onView("day")}>Day</button>
        <button onClick={() => onView("agenda")}>Agenda</button>
      </div>
    </div>
  );
};

// Configure the localizer for dateFns
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

// Main Calendar component
const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date()); // Track the current selected date
  const [view, setView] = useState("month"); // Track the current view

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

  const handleDateClick = (slotInfo) => {
    // Set the current date when a date is clicked
    setCurrentDate(slotInfo.start);
  };

  const handleViewChange = (view) => {
    setView(view); // Update the view state when the view changes
  };

  return (
    <div className="calendar-container">
      <Calendar
        components={{
          toolbar: (props) => (
            <MyCustomToolbar {...props} date={currentDate} /> // Pass currentDate to toolbar
          ),
        }}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={view}
        selectable
        onSelectSlot={handleDateClick} // Handle date clicks on the calendar
        onSelectEvent={handleEvents} // Handle event clicks
        onNavigate={(date) => setCurrentDate(date)} // Update currentDate when navigating
        onView={handleViewChange} // Update view when it changes
        style={{
          border: "1px solid #ccc",
          height: 700,
          borderRadius: "8px",
          backgroundColor: "#fff",
          fontFamily: "inherit",
          width: 1350,
        }}
      />
    </div>
  );
};

export default CalendarComponent;
