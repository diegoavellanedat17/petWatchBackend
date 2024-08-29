import { Request, Response } from "express";
import {
  createPetInDB,
  getUserPetsFromDB,
  getAllPetsFromDB,
  updatePetInDB,
  deletePetFromDB,
} from "../models/petModel";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const createPet = async (req: AuthenticatedRequest, res: Response) => {
  const { name, age, type, breed } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  const userId = req.user.id;
  try {
    const petId = await createPetInDB(name, age, type, breed, userId);
    res.status(201).json({ message: "Pet created successfully", petId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserPets = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  const userId = req.user.id;

  try {
    const pets = await getUserPetsFromDB(userId);
    res.status(200).json({ message: "Pets retrieved successfully", pets });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPets = async (req: Request, res: Response) => {
  try {
    const pets = await getAllPetsFromDB();
    res.status(200).json({ message: "All pets retrieved successfully", pets });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePet = async (req: Request, res: Response) => {
  const { petId } = req.params;
  const { name, age, type, breed, imageUrl } = req.body;
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const success = await updatePetInDB(
      petId,
      name,
      age,
      type,
      breed,
      imageUrl
    );
    if (success) {
      res.status(200).json({ message: "Pet updated successfully" });
    } else {
      res.status(404).json({ message: "Pet not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const deletePet = async (req: Request, res: Response) => {
  const { petId } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const success = await deletePetFromDB(petId);
    if (success) {
      res.status(200).json({ message: "Pet deleted successfully" });
    } else {
      res.status(404).json({ message: "Pet not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
