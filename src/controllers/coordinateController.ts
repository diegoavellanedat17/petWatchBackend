import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authenticateJWT";
import {
  saveCoordinate,
  getCoordinatesByPetId,
} from "../services/coordinateService";
import { getPetById } from "../services/petService";

// Controller to create a new coordinate
export const createCoordinate = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { lat, lon, sendDate } = req.body;
  const { petId } = req.params;

  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  const userId = req.user.id;

  if (
    typeof lat !== "number" ||
    typeof lon !== "number" ||
    typeof sendDate !== "string" ||
    !petId
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const pet = await getPetById(petId);

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    if (pet.owner_id.toString() !== userId) {
      return res.status(403).json({
        error: "User is not authorized to add coordinates for this pet",
      });
    }

    // Save the coordinate with the petId
    await saveCoordinate(lat, lon, sendDate, petId);
    res.status(201).json({ message: "Coordinate saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createAppCoordinate = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { lat, lon, sendDate } = req.body;
  const { petId } = req.params;

  if (
    typeof lat !== "number" ||
    typeof lon !== "number" ||
    typeof sendDate !== "string" ||
    !petId
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const pet = await getPetById(petId);

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }
    await saveCoordinate(lat, lon, sendDate, petId);
    res.status(201).json({ message: "Coordinate saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchPetCoordinates = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { petId } = req.params;
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  const userId = req.user.id;
  try {
    const pet = await getPetById(petId);

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    if (pet.owner_id.toString() !== userId) {
      return res.status(403).json({
        error: "User is not authorized to view coordinates for this pet",
      });
    }

    const coordinates = await getCoordinatesByPetId(petId);
    res.status(200).json(coordinates);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
