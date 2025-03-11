import React, { useState, useEffect } from "react";
import {Calendar, dateFnsLocalizer} from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import "react-big-calendar/lib/css/react-big-calendar.css";
import {useResizeDetector} from "react-resize-detector";
const locales = {
    'en-US': enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), {weekStartsOn: 0}),
    getDay,
    locales,
})

const CalendarComponent = () => {
    const [events, setEvents] = useState([]);
    const {width, ref} = useResizeDetector();

    useEffect(() => {
        const savedEvents = JSON.parse(localStorage.getItem("events"));
        if (savedEvents) setEvents(savedEvents);
    }, []);

   useEffect(() => {
        localStorage.setItem("events", JSON.stringify(events));
   }, [events]);

    const handleEvents = ({start, end}) => {
        const title = window.prompt("Event Title: ");
        if (title) {
            const newEvent = {title, start, end, allDay: true};
            setEvents([...events, newEvent]) ;
        }
    };

    const handleDeleteEvent = (event) => {
        if (window.confirm(`Delete '${event.title}'?`))
        {
            setEvents(events.filter((e) => e !== event));
        }
    };

    return (
        <div ref={ref} className="calendar-container">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                selectable
                style={{border: "1px solid #ccc",
                    height: 700,
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    width: 1350,
                    }}
            />
        </div>
    );
};

export default CalendarComponent;
