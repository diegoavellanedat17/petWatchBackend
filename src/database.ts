import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dbPromise = open({
  filename: "./database.db",
  driver: sqlite3.Database,
});

const getDatabase = async () => {
  return dbPromise;
};

export default getDatabase;
