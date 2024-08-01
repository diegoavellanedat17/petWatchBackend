import express from "express";
import bodyParser from "body-parser";
import coordinateRoutes from "./routes/coordinateRoutes";
import { initDatabase } from "./models/coordinateModel";

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use("/api", coordinateRoutes);

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  await initDatabase();
  console.log("Database initialized");
});
