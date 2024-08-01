import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import https from "https";
import coordinateRoutes from "./routes/coordinateRoutes";
import { initDatabase } from "./models/coordinateModel";

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());
app.use("/api", coordinateRoutes);

const privateKey = fs.readFileSync("key.pem", "utf8");
const certificate = fs.readFileSync("cert.pem", "utf8");

const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, async () => {
  console.log(`HTTPS Server running on https://localhost:${port}`);
  await initDatabase();
  console.log("Database initialized");
});
