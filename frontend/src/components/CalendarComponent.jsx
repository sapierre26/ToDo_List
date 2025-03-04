import React, { useState, useEffect } from 'react';
import {Calendar, dateFnsLocalizer} from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {useResizeDetector} from 'react-resize-detector';
const locales = {
    'en-US': enUS,
}
const MyCustomToolbar = ({label, onNavigate, onView}) => {
    //custom toolbar and props are date and onNavigate
    
    const date = new Date(label);
    const month = label.split(' ');
    console.log(month[0]);
    
    //Months to get the target value in a naive code
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = Array.from({ length:  200}, (_, i) => new Date().getFullYear() - 100 + i); // Past 5 years to future 5 years

    const handleMonthChange = (event) => {
        const newMonth = months.indexOf(event.target.value);
        onNavigate('DATE', new Date(date.getFullYear(), newMonth, 1));
    };

    const handleYearChange = (event) => {
        const newYear = parseInt(event.target.value);
        onNavigate('DATE', new Date(newYear, date.getMonth(), 1));
    };

    return (
        <div>
            <div className='rbc-btn-group'>
                <button onClick={() => onNavigate('PREV')}>←</button>
                
                <button type='button' onClick={() => onNavigate('TODAY')}>Today</button>

                <button onClick={() => onNavigate('NEXT')}>→</button>
            </div>
            <div className='rbc-btn-group' style={{position: 'relative', display: 'flex', justifyContent: 'right', alignItems: 'right'}}>
                <button onClick={() => onView('month')}>Month</button>
                <button onClick={() => onView('week')}>Week</button>
                <button onClick={() => onView('day')}>Day</button>
            </div>
            <div className='rbc-btn-group' style={{position:'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '0.7rem'}}>
                <select value={months[date.getMonth()]} onChange={handleMonthChange} style={{color: '#000000', backgroundColor: '#ffffff', fontSize: 'larger', fontFamily: 'inherit'}}>
                    {months.map((month, index) => (
                        <option key={index} value={month}>{month}</option>
                    ))}
                </select>

                <select value={date.getFullYear()} onChange={handleYearChange}  style={{color: '#000000', backgroundColor: '#ffffff', fontSize: 'larger', fontFamily: 'inherit'}}>
                    {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};


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
        const savedEvents = JSON.parse(localStorage.getItem('events'));
        if (savedEvents) setEvents(savedEvents);
    }, []);

   useEffect(() => {
        localStorage.setItem('events', JSON.stringify(events));
   }, [events]);

    const handleEvents = ({start, end}) => {
        const title = window.prompt('Event Title: ');
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
        <div ref={ref} className='calendar-container'>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor='start'
                endAccessor='end'
                defaultView='month'
                selectable
                components={{
                    toolbar: MyCustomToolbar 
                }}
                style={{border: '1px solid #ccc',
                    height: 700,
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    fontFamily: 'inherit',
                    width: 1350,
                    }}
            />
        </div>
    );
};

export default CalendarComponent;