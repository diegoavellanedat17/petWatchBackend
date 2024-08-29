import { Request, Response } from "express";
import {
  createPetInDB,
  getUserPetsFromDB,
  getAllPetsFromDB,
  updatePetInDB,
  deletePetFromDB,
  getPetById,
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

export const updatePet = async (req: AuthenticatedRequest, res: Response) => {
  const { name, age, type, breed, imageUrl } = req.body;
  const { petId } = req.params;

  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const userId = req.user.id;

  try {
    const pet = await getPetById(petId);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (pet.owner_id !== userId) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this pet" });
    }

    const success = await updatePetInDB(
      petId,
      name,
      age,
      type,
      breed,
      imageUrl
    );

    if (success) {
      const updatedPet = await getPetById(petId);
      res
        .status(200)
        .json({ message: "Pet updated successfully", pet: updatedPet });
    } else {
      res.status(404).json({ message: "Pet not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePet = async (req: AuthenticatedRequest, res: Response) => {
  const { petId } = req.params;

  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const userId = req.user.id;

  try {
    const pet = await getPetById(petId);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (pet.owner_id !== userId) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this pet" });
    }

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

export const getPet = async (req: AuthenticatedRequest, res: Response) => {
  const { petId } = req.params;

  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const userId = req.user.id;

  try {
    const pet = await getPetById(petId);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (pet.owner_id !== userId) {
      return res
        .status(403)
        .json({ message: "User not authorized to get this pet" });
    }
    res.status(200).json({ message: "Pet retrieved successfully", pet });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
