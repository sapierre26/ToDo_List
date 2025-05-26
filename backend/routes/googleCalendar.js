const express = require("express");
const { google } = require("googleapis");
const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Path to your service account key file
//const KEYFILEPATH = path.join(__dirname, '../config/todo-list-460900-89c2f5d9a1ce.json');

// Scopes for read-only access to Google Calendar
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

// Authenticate using the service account
// const auth = new google.auth.GoogleAuth({
//   keyFile: KEYFILEPATH,
//   scopes: SCOPES,
// });

router.get("/auth", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // Ensures refresh token is returned every time
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

    // Save tokens in user session or database
    req.session.tokens = tokens;

    res.redirect("http://localhost:5173/Calendar");
  } catch (error) {
    console.error("OAuth Callback Error:", error);
    res.status(500).send("Error during Google OAuth callback");
  }
});

// Initialize the Google Calendar API client
//const calendar = google.calendar({ version: 'v3', auth });

router.get("/events", async (req, res) => {
  const tokens = req.session.tokens;
  if (!tokens) return res.status(401).send("Not authorized with Google");
  oauth2Client.setCredentials(tokens);
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  //   try {
  //     const authClient = await auth.getClient();
  //     const result = await calendar.events.list({
  //       auth: authClient,
  //       calendarId: 'primary',
  //       timeMin: new Date().toISOString(),
  //       maxResults: 20,
  //       singleEvents: true,
  //       orderBy: 'startTime',
  //     });

  //     const events = result.data.items;
  //     res.json(events);
  //   } catch (error) {
  //     console.error("Error fetching Google Calendar events:", error);
  //     res.status(500).json({error: 'Failed to fetch Google Calendar events'});
  //   }
  // });
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

// Function to list upcoming events
// async function listEvents() {
//   try {
//     const res = await calendar.events.list({
//       calendarId: 'primary', // Use 'primary' for the primary calendar
//       timeMin: (new Date()).toISOString(),
//       maxResults: 10,
//       singleEvents: true,
//       orderBy: 'startTime',
//     });
//     const events = res.data.items;
//     if (events.length) {
//       console.log('Upcoming events:');
//       events.map((event, i) => {
//         console.log(`${event.summary} (${event.start.dateTime || event.start.date})`);
//       });
//     } else {
//       console.log('No upcoming events found.');
//     }
//   } catch (error) {
//     console.error('Error fetching events:', error);
//   }
// }

// listEvents();

module.exports = router;
