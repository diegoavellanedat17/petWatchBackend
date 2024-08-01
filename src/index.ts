import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import coordinateRoutes from "./routes/coordinateRoutes";
import { initDatabase } from "./models/coordinateModel";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());
app.use("/api", coordinateRoutes);

app.listen(port, async () => {
  console.log(`HTTPS Server running on https://localhost:${port}`);
  await initDatabase();
  console.log("Database initialized");
});
