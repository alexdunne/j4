/**
 Description:
   Add shifts to Google calendar and fetch a summary of the next week/month

 Commands:
   hubot show all shift hours - Shows the start and end times of all shift types
   hubot set day shift hours between (start) and (end) - Updates the day shift start and end times to the ones provided
   hubot set night shift hours between (start) and (end) - Updates the night shift start and end times to the ones provided
   hubot set study day hours between (start) and (end) - Updates the study day start and end times to the ones provided
   hubot add a day shift for (date) - Creates a day shift for the date provided
   hubot add a night shift for (date) - Creates a night shift for the date provided
   hubot add a study day for (date) - Creates a study day for the date provided
*/

const format = require("date-fns/format");
const parse = require("date-fns/parse");
const addDays = require("date-fns/add_days");

const botReporterAdapter = require("../lib/reporter/botReporterAdapter");
const calendar = require("../lib/external-services/google/calendar");

const SHIFT_TYPES = {
  DAY: 1,
  NIGHT: 2,
  STUDY: 3
};

const getShiftTypeKeyPrefix = shiftType => {
  return `shift-coordinator:shift-type:${shiftType}:times`;
};

module.exports = robot => {
  const setShiftTypeHours = (shiftType, start, end) => {
    robot.brain.set(getShiftTypeKeyPrefix(shiftType), {
      start: {
        hour: start.split(":")[0],
        minute: start.split(":")[1]
      },
      end: {
        hour: end.split(":")[0],
        minute: end.split(":")[1]
      }
    });
  };

  const getShiftTypeHours = shiftType => {
    const hours = robot.brain.get(getShiftTypeKeyPrefix(shiftType));

    if (!hours) {
      throw new Error("This shift type does not have its hours set");
    }

    return hours;
  };

  const getShiftTypeEventSummary = shiftType => {
    const typeToSummaryMap = {
      [SHIFT_TYPES.DAY]: "Day shift",
      [SHIFT_TYPES.NIGHT]: "Night shift",
      [SHIFT_TYPES.STUDY]: "Study shift"
    };

    if (!typeToSummaryMap[shiftType]) {
      throw new Error("Attempted to create an event for an unsupported type");
    }

    return typeToSummaryMap[shiftType];
  };

  const getEventDateTimesForShiftType = (date, shiftType) => {
    const hours = getShiftTypeHours(shiftType);

    let start = new Date(date);
    let end = new Date(date);

    start.setHours(hours.start.hour, hours.start.minute);
    end.setHours(hours.end.hour, hours.end.hour);

    if (shiftType === SHIFT_TYPES.NIGHT) {
      end = addDays(end, 1);
    }

    return { start, end };
  };

  const addShiftRequest = async (res, shiftType) => {
    try {
      const parsedDate = parse(res.match[1]);
      const dateTimes = getEventDateTimesForShiftType(parsedDate, shiftType);

      const event = {
        summary: getShiftTypeEventSummary(shiftType),
        start: { dateTime: dateTimes.start, timeZone: process.env.HUBOT_TIMEZONE },
        end: { dateTime: dateTimes.end, timeZone: process.env.HUBOT_TIMEZONE }
      };

      await calendar.createEvent(robot.brain, botReporterAdapter(res), event);

      res.send(`Added a new day shift entry to your calendar ${format(parsedDate, "Do MMMM")}`);
      res.send(`The shift begins at ${dateTimes.start} and ends at ${dateTimes.end}`);
    } catch (err) {
      res.send(`Something went wrong. ${err}`);
    }
  };

  robot.respond(/show all shift hours/i, function(res) {
    const dayHours = getShiftTypeHours(SHIFT_TYPES.DAY);
    const nightHours = getShiftTypeHours(SHIFT_TYPES.NIGHT);
    const studyHours = getShiftTypeHours(SHIFT_TYPES.STUDY);

    const response = [];
    response.push(
      dayHours
        ? `A day shift starts a ${dayHours.start} and ends at ${dayHours.end}`
        : "No times set for day shift"
    );
    response.push(
      nightHours
        ? `A night shift starts a ${nightHours.start} and ends at ${nightHours.end}`
        : "No times set for night shift"
    );
    response.push(
      studyHours
        ? `A study day starts a ${studyHours.start} and ends at ${studyHours.end}`
        : "No times set for study day"
    );

    res.send(response.join("\n"));
  });

  robot.respond(/set day shift hours between (.*) and (.*)/i, function(res) {
    setShiftTypeHours(SHIFT_TYPES.DAY, res.match[1], res.match[2]);
    res.send(`A day shift now starts at ${res.match[1]} and ends at ${res.match[2]}`);
  });

  robot.respond(/set night shift hours between (.*) and (.*)/i, function(res) {
    setShiftTypeHours(SHIFT_TYPES.NIGHT, res.match[1], res.match[2]);
    res.send(`A night shift now starts at ${res.match[1]} and ends at ${res.match[2]}`);
  });

  robot.respond(/set study day hours between (.*) and (.*)/i, function(res) {
    setShiftTypeHours(SHIFT_TYPES.STUDY, res.match[1], res.match[2]);
    res.send(`A study day now starts at ${res.match[1]} and ends at ${res.match[2]}`);
  });

  robot.respond(/add a day shift for (.*)/i, function(res) {
    addShiftRequest(res, SHIFT_TYPES.DAY);
  });

  robot.respond(/add a night shift for (.*)/i, function(res) {
    addShiftRequest(res, SHIFT_TYPES.NIGHT);
  });

  robot.respond(/add a study day for (.*)/i, function(res) {
    addShiftRequest(res, SHIFT_TYPES.STUDY);
  });
};
