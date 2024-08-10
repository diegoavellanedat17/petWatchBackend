import getDatabase from "../database";

export const savePotentialUser = async (
  name: string,
  phone: string,
  email: string,
  type: string
) => {
  const db = await getDatabase();
  await db.run(
    `INSERT INTO potential_users (name, phone, email, type) VALUES (?, ?, ?, ?)`,
    [name, phone, email, type]
  );
};

export const getAllPotentialUsers = async () => {
  const db = await getDatabase();
  const result = await db.all(`SELECT * FROM potential_users`);
  return result;
};
