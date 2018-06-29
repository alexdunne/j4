const path = require("path");
const { JWT } = require("google-auth-library");

const keys = require("../../../j4-bot.json");

const scopes = ["https://www.googleapis.com/auth/calendar"];

module.exports = {
  getClient: async () => {
    return new JWT({
      email: keys.client_email,
      key: keys.private_key,
      scopes,
      subject: "hi@alexdunne.net"
    });
  }
};
