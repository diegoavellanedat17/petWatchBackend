import https from "https";
import fs from "fs";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database";
import coordinateRoutes from "./routes/coordinateRoutes";
import potentialUserRoutes from "./routes/potentialUserRoutes";
import authRoutes from "./routes/authRoutes";
import petRoutes from "./routes/petRoutes";

dotenv.config();
const app = express();
const port = 443; // Standard HTTPS port

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(coordinateRoutes);
app.use(potentialUserRoutes);
app.use(authRoutes);
app.use(petRoutes);

// Resolve the correct path to the SSL certificates
const privateKey = fs.readFileSync(
  path.join(__dirname, "ssl", "privatekey.pem"), // The private key file
  "utf8"
);
const certificate = fs.readFileSync(
  path.join(__dirname, "ssl", "petwatch_tech.crt"), // The main certificate
  "utf8"
);
const ca = fs.readFileSync(
  path.join(__dirname, "ssl", "petwatch_tech.ca-bundle"), // The CA bundle
  "utf8"
);

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, async () => {
  console.log(`HTTPS Server running on https://localhost:${port}`);
});
