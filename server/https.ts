import https from "https";
import fs from "fs";
import app from "./index";

const options = {
  key: fs.readFileSync("path/to/your/private-key.pem"),
  cert: fs.readFileSync("path/to/your/certificate.pem"),
};

https.createServer(options, app).listen(443, () => {
  console.log("Server is running securely on https://localhost:443");
});