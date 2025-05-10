import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import PropTypes from "prop-types"; // Import PropTypes

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

// Custom toolbar
const MyCustomToolbar = ({ label, onNavigate, onView }) => {
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    let curr = startDate.getDate();
    if (curr < 10) {
      curr = "0" + curr;
    }
    let date = curr + " " + label;
    const newDate = parse(date, "dd MMMM yyyy", new Date());

    if (!isNaN(newDate.getTime())) {
      setStartDate(newDate);
    }
  }, [label, startDate]); // Added startDate to dependencies

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

MyCustomToolbar.propTypes = {
  label: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events"));
    if (savedEvents) setEvents(savedEvents);
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  return (
    <div className="calendar-container" style={{ height: "100%" }}>
      <Calendar
        components={{
          toolbar: MyCustomToolbar,
        }}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="day"
        views={["day"]}
        selectable
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fff",
          fontFamily: "inherit",
          width: 1350,
        }}
      />
    </div>
  );
};

const RightSide = () => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
        padding: "20px",
        borderSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <CalendarComponent />
    </div>
  );
};

export default RightSide;
