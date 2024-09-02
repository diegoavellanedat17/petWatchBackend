import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authenticateJWT";
import {
  createPet,
  getPetsByUserId,
  getAllPets,
  updatePet,
  deletePet,
  getPetById,
} from "../services/petService";

// Controller to create a new pet
export const createPetController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { name, bornDate, type, breed, imageUrl } = req.body;
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const userId = req.user.id;

    const newPet = await createPet({
      name,
      bornDate,
      type,
      breed,
      imageUrl,
      owner_id: userId,
    });
    res.status(201).json(newPet);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPetByIdController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { petId } = req.params;
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const userId = req.user.id;
    const pet = await getPetById(petId);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    if (pet.owner_id.toString() !== userId) {
      return res.status(403).json({
        error: "User is not authorized to view coordinates for this pet",
      });
    }
    res.status(200).json(pet);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPetAppByIdController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { petId } = req.params;

    const pet = await getPetById(petId);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.status(200).json(pet);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get all pets for a specific user
export const getUserPetsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const userId = req.user.id;
    const pets = await getPetsByUserId(userId);
    res.status(200).json(pets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get all pets
export const getAllPetsController = async (req: Request, res: Response) => {
  try {
    const pets = await getAllPets();
    res.status(200).json(pets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to update a pet by ID
export const updatePetController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { petId } = req.params;
    const { name, bornDate, type, breed, imageUrl } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const userId = req.user.id;
    const pet = await getPetById(petId);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }
    if (pet.owner_id.toString() !== userId) {
      return res.status(403).json({
        error: "User is not authorized to view coordinates for this pet",
      });
    }

    const updatedPet = await updatePet(petId, {
      name,
      bornDate,
      type,
      breed,
      imageUrl,
    });

    if (!updatedPet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res
      .status(200)
      .json({ message: "Pet updated successfully", pet: updatedPet });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to delete a pet by ID
export const deletePetController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { petId } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const userId = req.user.id;
    const pet = await getPetById(petId);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }
    if (pet.owner_id.toString() !== userId) {
      return res.status(403).json({
        error: "User is not authorized to view coordinates for this pet",
      });
    }

    const success = await deletePet(petId);

    if (!success) {
      return res.status(404).json({ message: "Unable to delete pet" });
    }

    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
