import React, { useState, useEffect } from 'react';
import {Calendar, dateFnsLocalizer} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Datepicker from 'react-datepicker';

const locales = {
    'en-US': enUS,
}

const MyCustomToolbar = ({label, onNavigate, onView}) => {
    //custom toolbar and props are date, onNavigate, and onView
    const [startDate, setStartDate] = useState(new Date());
    
    const handleDateChange = (date) => {
        setStartDate(date);
        onNavigate('DATE', date); // Moves the calendar view to the selected date
    };

    const handleTodayClick = () => {
        const today = new Date();
        setStartDate(today);
        onNavigate('TODAY'); // Navigate calendar to today
    };
    
    return (
        <div style={{display: 'flex', paddingBottom: '1rem'}}>
            <div className='calendar-nav' style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <button onClick={() => onNavigate('PREV')}>←</button> 
                    <button onClick={handleTodayClick}>Today</button>
                    <button onClick={() => onNavigate('NEXT')}>→</button>
            </div>          
        
            <div className='rbc-toolbar-label' style={{alignContent: 'baseline', flexGrow: 1, justifyItems: 'center'}}>
                <Datepicker
                    selected={startDate}
                    onChange={handleDateChange}
                    dateFormat='MMMM dd, yyyy'
                    tabIndex={1}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode='select'
                    onKeyDown={(e) => e.preventDefault()}
                    onFocus={(e) => e.target.blur()}
                    className='custom-datepicker'

                />
            </div>

            <div className='calendar-view'>
                <button onClick={() => onView('month')}>Month</button>
                <button onClick={() => onView('week')}>Week</button>
                <button onClick={() => onView('day')}>Day</button>
                <button onClick={() => onView('agenda')}>Agenda</button>
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
        <div className='calendar-container'>
            <Calendar
                components={{
                    toolbar: MyCustomToolbar 
                }}
                localizer={localizer}
                events={events}
                startAccessor='start'
                endAccessor='end'
                defaultView='month'
                selectable
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