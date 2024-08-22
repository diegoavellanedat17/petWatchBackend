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

const initUsersTable = async (db: any) => {
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cognito_id TEXT NOT NULL,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL
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

const initPetsTable = async (db: any) => {
  await db.run(`
    CREATE TABLE IF NOT EXISTS pets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER,
      type TEXT,
      breed TEXT,
      imageUrl TEXT,
      owner_id INTEGER NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    )
  `);
};

export const initDatabase = async () => {
  const db = await getDatabase();

  await initCoordinatesTable(db);
  await initPotentialUsersTable(db);
  await initUsersTable(db);
  await initPetsTable(db);

  console.log("Database initialized successfully.");
};
