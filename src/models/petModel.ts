import getDatabase from "../database";
import { v4 as uuidv4 } from "uuid";

export const createPetInDB = async (
  name: string,
  age: number,
  type: string,
  breed: string,
  ownerId: string
) => {
  const db = await getDatabase();
  const petId = uuidv4();

  await db.run(
    `INSERT INTO pets (id, name, age, type, breed, owner_id) VALUES (?, ?, ?, ?, ?, ?)`,
    [petId, name, age, type, breed, ownerId]
  );

  return petId;
};

export const getUserPetsFromDB = async (ownerId: string) => {
  const db = await getDatabase();
  const pets = await db.all(`SELECT * FROM pets WHERE owner_id = ?`, [ownerId]);

  return pets;
};

export const getAllPetsFromDB = async () => {
  const db = await getDatabase();
  const pets = await db.all(`SELECT * FROM pets`);
  return pets;
};

export const updatePetInDB = async (
  petId: string,
  name: string,
  age: number,
  type: string,
  breed: string,
  imageUrl?: string
) => {
  const db = await getDatabase();

  await db.run(
    `UPDATE pets SET name = ?, age = ?, type = ?, breed = ?, imageUrl = ? WHERE id = ?`,
    [name, age, type, breed, imageUrl, petId]
  );

  return true;
};

export const deletePetFromDB = async (petId: string) => {
  const db = await getDatabase();

  await db.run(`DELETE FROM pets WHERE id = ?`, [petId]);

  return true;
};
