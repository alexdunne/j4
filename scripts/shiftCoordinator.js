/**
 Description:
   Add shifts to Google calendar and fetch a summary of the next week/month

 Dependencies:
   "date-fns": "1.29.0"
   "googleapis": "27.0.0"

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

const SHIFT_TYPES = {
  DAY: 1,
  NIGHT: 2,
  STUDY: 3
};

const getShiftTypeKeyPrefix = type => {
  return `shift-coordinator:shift-type:${type}:times`;
};

module.exports = robot => {
  const setShiftTypeHours = (type, start, end) => {
    robot.brain.set(getShiftTypeKeyPrefix(type), { start, end });
  };

  const getShiftTypeHours = type => {
    return robot.brain.get(getShiftTypeKeyPrefix(type));
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
    robot.emit("google:authenticate", res, function(err, oauth) {
      console.log(err, oauth);
      const parsedDate = parse(res.match[1]);

      res.send(`Added a new day shift entry to your calendar ${format(parsedDate, "Do MMMM")}`);
    });
  });

  robot.respond(/add a night shift for (.*)/i, function(res) {
    console.log(res);
  });

  robot.respond(/add a study day for (.*)/i, function(res) {
    console.log(res);
  });
};
