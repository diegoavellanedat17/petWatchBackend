import { Request, Response } from "express";
import { saveCoordinate, getAllCoordinates } from "../models/coordinateModel";

export const createCoordinate = async (req: Request, res: Response) => {
  const { lat, lon, sendDate } = req.body;

  if (
    typeof lat !== "number" ||
    typeof lon !== "number" ||
    typeof sendDate !== "string"
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    await saveCoordinate(lat, lon, sendDate);
    res.status(201).json({ message: "Coordinate saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchAllCoordinates = async (req: Request, res: Response) => {
  try {
    const coordinates = await getAllCoordinates();
    res.status(200).json(coordinates);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
