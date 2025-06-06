import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isSameDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Datepicker from "react-datepicker";
import AddTask from "../todolist/addTask";
import {
  getTasksAndEventsByEndDate,
  getTasksForMonth,
  getGoogleCalendarEvents,
  getGoogleTasks,
} from "../../api/tasks";
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

const MyCustomToolbar = ({
  label,
  onNavigate,
  onView,
  currentDate,
  setCurrentDate,
  setTaskDate,
  isGoogleConnected,
}) => {
  useEffect(() => {
    const parsedMonthYear = parse(label, "MMMM yyyy", new Date());

    if (!isNaN(parsedMonthYear.getTime())) {
      const currentDay = currentDate.getDate();
      const targetDate = new Date(
        parsedMonthYear.getFullYear(),
        parsedMonthYear.getMonth(),
        currentDay,
      );
      const lastDayOfMonth = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth() + 1,
        0,
      ).getDate();

      if (currentDay > lastDayOfMonth) {
        targetDate.setDate(lastDayOfMonth);
      }

      if (targetDate.toDateString() !== currentDate.toDateString()) {
        setCurrentDate(targetDate);
      }
    }
  }, [label, currentDate, setCurrentDate]);

  const handleDateChange = (date) => {
    setCurrentDate(date);
    setTaskDate(date);
    onNavigate("DATE", date);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    setTaskDate(today);
    onNavigate("TODAY", today);
  };

  const handleNavigate = (action) => {
    onNavigate(action);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingBottom: "1rem",
        gap: "10px",
        flexWrap: "wrap", // optional, to wrap on small screens
      }}
    >
      <div className="calendar-nav" style={{ display: "flex", gap: "8px" }}>
        <button onClick={() => handleNavigate("PREV")}>←</button>
        <button onClick={handleTodayClick}>Today</button>
        <button onClick={() => handleNavigate("NEXT")}>→</button>
      </div>

      <div className="rbc-toolbar-label" style={{ flexShrink: 0 }}>
        <Datepicker
          selected={currentDate}
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
      {/* {!isGoogleConnected && (
        <div style={{ margin: "0.5rem 0" }}>
          <button
            onClick={() => {
              window.location.href =
                "http://localhost:8000/api/google-calendar/auth";
            }}
            className="google-calendar-button"
          >
            Import
          </button>
        </div>
      )} */}

      <div className="calendar-view">
        {!isGoogleConnected && (
          <button
            onClick={() => {
              window.location.href =
                "http://localhost:8000/api/google-calendar/auth";
            }}
            className="google-calendar-button"
          >
            Import
          </button>
        )}
        <button
          onClick={() => {
            onView("month");
            onNavigate("DATE", currentDate);
          }}
        >
          Month
        </button>
        <button
          onClick={() => {
            onView("week");
            onNavigate("DATE", currentDate);
          }}
        >
          Week
        </button>
        <button
          onClick={() => {
            onView("day");
            onNavigate("DATE", currentDate);
          }}
        >
          Day
        </button>
      </div>
    </div>
  );
};

MyCustomToolbar.propTypes = {
  label: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  currentDate: PropTypes.instanceOf(Date).isRequired,
  setCurrentDate: PropTypes.func.isRequired,
  setTaskDate: PropTypes.func.isRequired,
  isGoogleConnected: PropTypes.bool.isRequired,
};

const CalendarComponent = () => {
  const [tasks, setTasks] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [taskDate, setTaskDate] = useState(new Date());
  const [dailyTasks, setDailyTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clickTimeout, setClickTimeout] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);

  const mergedEvents = [...tasks, ...calendarEvents];

  const filteredEvents = selectedPriority
    ? mergedEvents.filter(
        (event) => event.resource?.priority === selectedPriority,
      )
    : mergedEvents;

  useEffect(() => {
    const fetchTasks = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
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
        const items = await getTasksForMonth(startOfMonth, endOfMonth, token);

        const statusRes = await fetch(
          "http://localhost:8000/api/google-calendar/status",
          {
            credentials: "include",
          },
        );

        const statusData = await statusRes.json();
        setIsGoogleConnected(statusData.connected);

        let googleEvents = [];
        if (statusData.connected) {
          googleEvents = await getGoogleCalendarEvents();
        }

        let googleTasks = [];
        if (statusData.connected) {
          googleTasks = await getGoogleTasks();
        }

        const taskList = [];
        const eventList = [];
        if (Array.isArray(items)) {
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
        }

        const googleFormatted = googleEvents.map((gEvent) => ({
          id: gEvent.id,
          title: gEvent.title,
          start: new Date(gEvent.start),
          end: new Date(gEvent.end),
          resource: {
            label: "Event",
            description: gEvent.description || "",
            priority: null,
          },
        }));

        const googleTasksFormatted = googleTasks
          .map((gTask) => {
            const start = gTask.due ? new Date(gTask.due) : null;
            if (!start) return null;

            const end = new Date(start.getTime());
            return {
              id: gTask.id,
              title: gTask.title,
              start,
              end,
              resource: {
                label: "Task",
                description: gTask.notes || "",
                priority: null,
              },
            };
          })
          .filter(Boolean);

        setTasks(taskList);
        setCalendarEvents([
          ...eventList,
          ...googleFormatted,
          ...googleTasksFormatted,
        ]);

        const dailyItems = await getTasksAndEventsByEndDate(currentDate, token);
        const dailyGoogleTasks = googleTasksFormatted.filter((task) =>
          isSameDay(task.start, currentDate),
        );
        const dailyGoogleEvents = googleFormatted.filter((event) =>
          isSameDay(event.start, currentDate),
        );

        const mapToCalendarEvent = (item) => ({
          id: item._id,
          title: item.title,
          start: new Date(item.startDate),
          end: new Date(item.endDate),
          resource: item,
        });

        const mapItemsToCalendarEvents = (items) =>
          Array.isArray(items) ? items.map(mapToCalendarEvent) : [];

        setDailyTasks([
          ...mapItemsToCalendarEvents(dailyItems),
          ...dailyGoogleTasks,
          ...dailyGoogleEvents,
        ]);
      } catch (error) {
        console.error("Error fetching tasks/events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [currentDate, view]);

  const handleDateClick = (date) => {
    setCurrentDate(date);
    setIsAddTaskModalOpen(false);
  };

  const handleSelectSlot = ({ start }) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      setTaskDate(start);
      setIsAddTaskModalOpen(true);
      setCurrentDate(start);
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
      resource: newTask,
    };

    if (newTask.label === "Event") {
      setCalendarEvents((prev) => [...prev, newEvent]);
    } else {
      setTasks((prev) => [...prev, newEvent]);
    }

    if (isSameDay(new Date(newTask.startDate), currentDate)) {
      setDailyTasks((prev) => [...prev, newEvent]);
    }

    setIsAddTaskModalOpen(false);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask._id
          ? {
              id: updatedTask._id,
              title: updatedTask.title,
              start: new Date(updatedTask.startDate),
              end: new Date(updatedTask.endDate),
              resource: updatedTask,
            }
          : task
      )
    );

    // Also update dailyTasks if it belongs to currentDate
    if (isSameDay(new Date(updatedTask.startDate), currentDate)) {
      setDailyTasks((prev) => {
        const exists = prev.find((t) => t.id === updatedTask._id);
        const updatedEvent = {
          id: updatedTask._id,
          title: updatedTask.title,
          start: new Date(updatedTask.startDate),
          end: new Date(updatedTask.endDate),
          resource: updatedTask,
        };

        if (exists) {
          return prev.map((t) => (t.id === updatedTask._id ? updatedEvent : t));
        } else {
          return [...prev, updatedEvent];
        }
      });
    } else {
      // If updated task is not on currentDate, remove it from dailyTasks if exists
      setDailyTasks((prev) => prev.filter((t) => t.id !== updatedTask._id));
    }
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
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                setTaskDate={setTaskDate}
                onView={handleViewChange}
                isGoogleConnected={isGoogleConnected ?? false}
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
          onSelectEvent={() => {
            if (view !== "day") setView("day");
          }}
          onNavigate={(date) => {
            setCurrentDate(date);
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
              isCompact={true}
            />
          </div>
        ) : (
          <div className="tasks-container">
            <h3>Tasks for {format(currentDate, "MMMM dd, yyyy")}</h3>
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
                        <p className="task-title">{event.title}</p>
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