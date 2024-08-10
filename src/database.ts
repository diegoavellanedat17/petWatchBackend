import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";

// Ensure the database directory exists
const dbDirectory = path.join(__dirname, "database");
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

const dbPromise = open({
  filename: path.join(dbDirectory, "database.db"),
  driver: sqlite3.Database,
});

const getDatabase = async () => {
  return dbPromise;
};

export default getDatabase;