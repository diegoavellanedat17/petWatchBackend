import { Request, Response } from "express";
import {
  savePotentialUser,
  getAllPotentialUsers,
} from "../services/potentialUserService";

export const joinUs = async (req: Request, res: Response) => {
  const { name, phone, email, type } = req.body;

  // Validate the input
  if (!name || !phone || !email || !type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!["DEVELOPER", "USER", "INVESTOR"].includes(type)) {
    return res.status(400).json({ error: "Invalid type" });
  }

  try {
    await savePotentialUser(name, phone, email, type);
    res.status(201).json({ message: "Potential user created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPotentialUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllPotentialUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
