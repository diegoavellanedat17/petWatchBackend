import getDatabase from "../database";

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
