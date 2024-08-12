import { Request, Response } from "express";
import {
  savePotentialUser,
  getAllPotentialUsers,
} from "../models/potentialUserModel";

import { sendConfirmationEmail } from "../utils";

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
    await sendConfirmationEmail(email, name);
    res.status(201).json({ message: "Potential user created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for getting all potential users
export const getPotentialUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllPotentialUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
