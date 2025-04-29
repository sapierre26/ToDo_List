import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isSameMonth, isSameDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Datepicker from "react-datepicker";
import AddTask from "../todolist/addTask";
import { getTasksAndEventsByEndDate, getTasksForMonth } from "../../api/tasks";
import "./calendar.css";

import PriorityFilterSidebar from '../PriorityFilterSidebar/page.jsx';

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

const MonthEvent = ({ event }) => {
  return (
    <div className="rbc-month-event-content">
      <div className="event-title">{event.title}</div>
    </div>
  );
};

const MyCustomToolbar = ({ label, onNavigate, onView, date, setTaskDate }) => {
  const [startDate, setStartDate] = useState(date || new Date());

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
    setTaskDate(date);
    onNavigate("DATE", date);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setStartDate(today);
    setTaskDate(today);
    onNavigate("TODAY");
  };

  const handleNavigate = (action, date = null) => {
    let newDate;
    switch (action) {
      case "PREV":
        newDate = new Date(startDate);
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case "NEXT":
        newDate = new Date(startDate);
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "TODAY":
        newDate = new Date();
        break;
      case "DATE":
        newDate = date;
        break;
      default:
        return;
    }

    setStartDate(newDate);
    setTaskDate(newDate);
    onNavigate(action, newDate);
  };

  return (
    <div style={{ display: "flex", paddingBottom: "1rem" }}>
      <div className="calendar-nav" style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
        <button onClick={() => handleNavigate("PREV")}>←</button>
        <button onClick={handleTodayClick}>Today</button>
        <button onClick={() => handleNavigate("NEXT")}>→</button>
      </div>

      <div className="rbc-toolbar-label" style={{ flexGrow: 1, justifyItems: "center" }}>
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
      </div>
    </div>
  )
};

export const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [taskDate, setTaskDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyTasks, setDailyTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clickTimeout, setClickTimeout] = useState(null);

  const [selectedPriority, setSelectedPriority] = useState(null);
  const filteredEvents = selectedPriority ? events.filter((event) => event.priority === selectedPriority) : events;
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const tasks = await getTasksForMonth(startOfMonth, endOfMonth);

        const taskEvents = tasks.map(task => ({
          id: task._id,
          title: task.title,
          start: new Date(task.startDate),
          end: new Date(task.endDate),
          allDay: task.label === 'Event',
          resource: task
        }));

        setEvents(taskEvents);
        
        if (view !== 'month') {
          const dailyTasks = await getTasksAndEventsByEndDate(selectedDate);
          setDailyTasks(dailyTasks.map(task => ({
            id: task._id,
            title: task.title,
            start: new Date(task.startDate),
            end: new Date(task.endDate),
            allDay: task.label === 'Event',
            resource: task
          })));
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [currentDate, selectedDate, view]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsAddTaskModalOpen(false);
  };

  const handleSelectSlot = (slotInfo) => {
    const { start } = slotInfo;
    
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      setTaskDate(start);
      setIsAddTaskModalOpen(true);
    } else {
      const timeout = setTimeout(() => {
        handleDateClick(start);
        setClickTimeout(null);
      }, 200);
      setClickTimeout(timeout);
    }
  };

  const handleViewChange = (view) => {
    setView(view);
  };

  const handleTaskAdded = (newTask) => {
    const newEvent = {
      id: newTask._id,
      title: newTask.title,
      start: new Date(newTask.startDate),
      end: new Date(newTask.endDate),
      allDay: newTask.label === 'Event',
      resource: newTask
    };
    
    setEvents(prev => [...prev, newEvent]);
    
    if (isSameDay(new Date(newTask.startDate), selectedDate)) {
      setDailyTasks(prev => [...prev, newEvent]);
    }
    
    setIsAddTaskModalOpen(false);
  };

  return (
    <div className="calendar-page-container">
      <div className="priority-container">
        <PriorityFilterSidebar
          selectedPriority={selectedPriority}
          onSelectPriority={setSelectedPriority}
        />
      </div>
      <div className="calendar-container">
        <Calendar
          components={{
            toolbar: (props) => (
              <MyCustomToolbar 
                {...props} 
                date={currentDate}
                setTaskDate={setSelectedDate}
                onNavigate={(action, date) => {
                  setCurrentDate(date || currentDate);
                  if (view !== 'month') {
                    setSelectedDate(date || currentDate);
                  }
                }}
                onView={handleViewChange}
              />
            ),
            month: {
              event: MonthEvent // Use our custom month event component
            }
          }}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView='month'
          view={view}
          views={['month', 'week', 'day']} // Removed 'agenda' from views
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) => {
            setSelectedDate(new Date(event.start));
            if (view !== 'day') {
              setView('day');
            }
          }}
          onDoubleClickEvent={() => {}}
          onNavigate={(date) => {
            setCurrentDate(date);
            if (view !== 'month') {
              setSelectedDate(date);
            }
          }}
          onView={handleViewChange}
          style={{
            height: "calc(100vh - 100px)",
            margin: "10px",
          }}
          eventPropGetter={(event) => ({
            className: `rbc-event-${event.resource?.priority?.toLowerCase() || 'medium'}`
          })}
        />
      </div>

      <div className="side-panel">
      {isAddTaskModalOpen ? (
        <div className="add-task-container">
          <AddTask
            taskDate={taskDate}
            onTaskAdded={handleTaskAdded}
            onClose={() => setIsAddTaskModalOpen(false)}
          />
        </div>
      ) : (
        <div className="tasks-container">
          <h2>Tasks for {format(selectedDate, "MMMM dd, yyyy")}</h2>
          {isLoading ? (
            <p>Loading tasks...</p>
          ) : dailyTasks.length > 0 ? (
            <ul className="task-list">
              {dailyTasks.map((event) => {
                const taskData = event.resource || {}; // Safely access resource data
                const isEvent = taskData.label === 'Event';
                
                return (
                  <li 
                    key={event.id} 
                    className={`task-item ${taskData.label?.toLowerCase() || 'task'}`}
                  >
                    <div className="task-content">
                      <div className="task-meta">
                        <span className="task-label">
                          {taskData.label || (isEvent ? 'Event' : 'Task')}
                        </span>
                        {!isEvent && (
                          <span className={`task-priority ${taskData.priority?.toLowerCase() || 'medium'}`}>
                            {taskData.priority || 'Medium'}
                          </span>
                        )}
                        {!event.allDay && (
                          <span className="task-time">
                            {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="task-title">{event.title}</h3>
                      
                      {taskData.description && (
                        <p className="task-description">
                          {taskData.description}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="no-tasks">No tasks for this date</p>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default CalendarComponent;
