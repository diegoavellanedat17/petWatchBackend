import getDatabase from "../database";

export const initDatabase = async () => {
  const db = await getDatabase();
  await db.run(`
    CREATE TABLE IF NOT EXISTS coordinates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lat REAL NOT NULL,
      lon REAL NOT NULL,
      sendDate TEXT NOT NULL
    )
  `);
};

export const saveCoordinate = async (
  lat: number,
  lon: number,
  sendDate: string
) => {
  const db = await getDatabase();
  await db.run(
    `INSERT INTO coordinates (lat, lon, sendDate) VALUES (?, ?, ?)`,
    [lat, lon, sendDate]
  );
};

export const getAllCoordinates = async () => {
  const db = await getDatabase();
  const result = await db.all(`SELECT * FROM coordinates`);
  return result;
};
