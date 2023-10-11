const fs = require("fs");
const { Client, LegacySessionAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Path where the session data will be stored
const SESSION_FILE_PATH = "./session.json";

// Load the session data if it has been previously saved
let sessionData = "";
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
  authStrategy: new LegacySessionAuth({
    session: sessionData,
  }),
});
// Save session values to the file upon successful auth
client.on("authenticated", (session) => {
  sessionData = session;
  try {
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session));
  } catch (error) {
    console.error(err);
  }
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
  switch (key) {
    case value:
      break;

    default:
      break;
  }
});

client.initialize();
