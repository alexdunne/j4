const { google } = require("googleapis");

const googleAuth = require("./auth");

const CALENDAR_ID_KEY = "external-services:google:calendar";

const createCalendar = async calendarClient => {
  const response = await calendarClient.calendars.insert({
    resource: { summary: "J4 Calendar" }
  });

  return response.data;
};

const getCalendarId = async (storage, reporter, calendarClient) => {
  const id = storage.get(CALENDAR_ID_KEY);

  if (id) {
    reporter.report("Could not find an existing calendar. Creating one now.");

    const calendar = await createCalendar(calendarClient);
    storage.set(CALENDAR_ID_KEY, calendar.id);

    reporter.report(`Calendar created: ${calendar.summary}`);

    return calendar.id;
  }

  return id;
};

module.exports = {
  createEvent: async (storage, reporter, event) => {
    const client = await googleAuth.getClient();

    const calendarClient = google.calendar({ version: "v3", auth: client });

    const calendarId = await getCalendarId(storage, reporter, calendarClient);

    const response = await calendarClient.events.insert({
      calendarId,
      resource: event
    });
  }
};
