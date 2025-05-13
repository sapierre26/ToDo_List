import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isSameDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Datepicker from "react-datepicker";
import AddTask from "../todolist/addTask";
import { getTasksAndEventsByEndDate, getTasksForMonth } from "../../api/tasks";
import "./calendar.css";
import PriorityFilterSidebar from "../PriorityFilterSidebar/page.jsx";
import PropTypes from "prop-types";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const MonthEvent = ({ event }) => (
  <div className="rbc-month-event-content">
    <div className="event-title">{event.title}</div>
  </div>
);

MonthEvent.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
};

const MyCustomToolbar = ({ label, onNavigate, onView, date, setTaskDate }) => {
  const [startDate, setStartDate] = useState(date || new Date());

  useEffect(() => {
    const formattedDate = format(startDate, "dd MMMM yyyy");
    const newDate = parse(formattedDate, "dd MMMM yyyy", new Date());
    if (!isNaN(newDate.getTime())) setStartDate(newDate);
  }, [label, startDate]);

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
      <div className="calendar-nav">
        <button onClick={() => handleNavigate("PREV")}>←</button>
        <button onClick={handleTodayClick}>Today</button>
        <button onClick={() => handleNavigate("NEXT")}>→</button>
      </div>

      <div className="rbc-toolbar-label">
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
  );
};

MyCustomToolbar.propTypes = {
  label: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  setTaskDate: PropTypes.func.isRequired,
};

const CalendarComponent = () => {
  const [tasks, setTasks] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [taskDate, setTaskDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyTasks, setDailyTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clickTimeout, setClickTimeout] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);

  const mergedEvents = [...tasks, ...calendarEvents];

  const filteredEvents = selectedPriority
    ? mergedEvents.filter(
        (event) => event.resource?.priority === selectedPriority,
      )
    : mergedEvents;

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1,
        );
        const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0,
        );
        const items = await getTasksForMonth(startOfMonth, endOfMonth);

        const taskList = [];
        const eventList = [];

        items.forEach((item) => {
          const calendarItem = {
            id: item._id,
            title: item.title,
            start: new Date(item.startDate),
            end: new Date(item.endDate),
            resource: item,
          };

          if (item.label === "Event") {
            eventList.push(calendarItem);
          } else {
            taskList.push(calendarItem);
          }
        });

        setTasks(taskList);
        setCalendarEvents(eventList);

        const dailyItems = await getTasksAndEventsByEndDate(selectedDate);
        setDailyTasks(
          dailyItems.map((item) => ({
            id: item._id,
            title: item.title,
            start: new Date(item.startDate),
            end: new Date(item.endDate),
            resource: item,
          })),
        );
      } catch (error) {
        console.error("Error fetching tasks/events:", error);
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

  const handleSelectSlot = ({ start }) => {
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

  const handleViewChange = (view) => setView(view);

  const handleTaskAdded = (newTask) => {
    const newEvent = {
      id: newTask._id,
      title: newTask.title,
      start: new Date(newTask.startDate),
      end: new Date(newTask.endDate),
      resource: newTask,
    };

    if (newTask.label === "Event") {
      setCalendarEvents((prev) => [...prev, newEvent]);
    } else {
      setTasks((prev) => [...prev, newEvent]);
    }

    if (isSameDay(new Date(newTask.startDate), selectedDate)) {
      setDailyTasks((prev) => [...prev, newEvent]);
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
                setTaskDate={(date) => {
                  setSelectedDate(date);
                  if (view !== "month") setCurrentDate(date);
                }}
                onNavigate={(action, date) => {
                  if (view !== "month" && date) setSelectedDate(date);
                }}
                onView={handleViewChange}
              />
            ),
            month: { event: MonthEvent },
          }}
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          views={["month", "week", "day"]}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) => {
            setSelectedDate(new Date(event.start));
            if (view !== "day") setView("day");
          }}
          onNavigate={(date) => {
            setCurrentDate(date);
            if (view !== "month") setSelectedDate(date);
          }}
          onView={handleViewChange}
          style={{ height: "calc(100vh - 100px)", margin: "10px" }}
          eventPropGetter={(event) => {
            const isEvent = event.resource?.label === "Event";
            return {
              className: isEvent
                ? "rbc-event-event"
                : `rbc-event-${event.resource?.priority?.toLowerCase() || "medium"}`,
            };
          }}
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
                  const taskData = event.resource || {};
                  const isEvent = taskData.label === "Event";

                  return (
                    <li
                      key={event.id}
                      className={`task-item ${taskData.label?.toLowerCase() || "task"}`}
                    >
                      <div className="task-content">
                        <div className="task-meta">
                          <span className="task-label">
                            {taskData.label || (isEvent ? "Event" : "Task")}
                          </span>
                          {!isEvent && (
                            <span
                              className={`task-priority ${taskData.priority?.toLowerCase() || "medium"}`}
                            >
                              {taskData.priority || "Medium"}
                            </span>
                          )}
                          <span className="task-time">
                            {isEvent
                              ? `${format(event.start, "h:mm a")} - ${format(event.end, "h:mm a")}`
                              : `${format(event.end, "h:mm a")}`}
                          </span>
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