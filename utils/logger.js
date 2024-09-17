import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logDirectory = join(__dirname, "../logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const getLogFilePath = () => {
  const date = new Date().toISOString().split("T")[0];
  return join(logDirectory, `${date}.log`);
};

const logToFile = (
  level,
  message,
  method = "UNKNOWN",
  url = "UNKNOWN",
  statusCode = "UNKNOWN",
  headers = {},
  payload = ""
) => {
  const logFilePath = getLogFilePath();
  const logMessage = `\n${new Date().toISOString()} [${level}]
Method: ${method}
URL: ${url}
Status: ${statusCode}
Headers: ${JSON.stringify(headers, null, 2)}
Payload: ${payload ? JSON.stringify(payload, null, 2) : "N/A"}
Response: ${message}`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error("Failed to write log:", err);
  });
};

export default logToFile;
