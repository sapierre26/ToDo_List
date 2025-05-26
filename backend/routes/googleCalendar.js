const express = require("express");
const { google } = require("googleapis");
const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/tasks.readonly",
];

router.get("/auth", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  res.redirect(authUrl);
});

router.get("/status", (req, res) => {
  if (req.session.tokens) {
    res.json({ connected: true });
  } else {
    res.json({ connected: false });
  }
});

router.get("/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    req.session.tokens = tokens;

    res.redirect("http://localhost:5173/Calendar");
  } catch (error) {
    console.error("OAuth Callback Error:", error);
    res.status(500).send("Error during Google OAuth callback");
  }
});

router.get("/events", async (req, res) => {
  const tokens = req.session.tokens;
  if (!tokens) return res.status(401).send("Not authorized with Google");
  oauth2Client.setCredentials(tokens);
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  try {
    let allEvents = [];
    let nextPageToken = null;
    do {
      const response = await calendar.events.list({
        calendarId: "primary",
        maxResults: 2500,
        singleEvents: true,
        orderBy: "startTime",
        pageToken: nextPageToken,
      });

      allEvents = allEvents.concat(response.data.items);
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    const formattedEvents = allEvents.map(event => ({
      id: event.id,
      title: event.summary || "(No title)",
      description: event.description || "",
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
    }));

    res.json(formattedEvents);

  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch events");
  }
});

router.get("/tasks", async (req, res) => {
  const tokens = req.session.tokens;
  if (!tokens) return res.status(401).send("Not authorized with Google");
  oauth2Client.setCredentials(tokens);

  try {
    const tasksAPI = google.tasks({ version: "v1", auth: oauth2Client });

    const { data: taskLists } = await tasksAPI.tasklists.list();
    const allTasks = [];

    for (const taskList of taskLists.items) {
      const { data: tasksData } = await tasksAPI.tasks.list({
        tasklist: taskList.id,
        showCompleted: false,
        maxResults: 100,
      });

      if (tasksData.items) {
        tasksData.items.forEach((task) => {
          allTasks.push({
            id: task.id,
            title: task.title,
            due: task.due,
            notes: task.notes,
            taskList: taskList.title,
          });
        });
      }
    }

    res.json(allTasks);
  } catch (error) {
    console.error("Error fetching Google Tasks:", error);
    res.status(500).send("Failed to fetch Google Tasks");
  }
});

module.exports = router;
