import getDatabase from "./database";

const initCoordinatesTable = async (db: any) => {
  await db.run(`
    CREATE TABLE IF NOT EXISTS coordinates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lat REAL NOT NULL,
      lon REAL NOT NULL,
      sendDate TEXT NOT NULL
    )
  `);
};

const initPotentialUsersTable = async (db: any) => {
  await db.run(`
    CREATE TABLE IF NOT EXISTS potential_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('DEVELOPER', 'USER', 'INVESTOR'))
    )
  `);
};

export const initDatabase = async () => {
  const db = await getDatabase();

  await initCoordinatesTable(db);
  await initPotentialUsersTable(db);

  console.log("Database initialized successfully.");
};
