import express from "express";
import {
  createPet,
  getUserPets,
  getAllPets,
  updatePet,
  deletePet,
} from "../controllers/petController";
import authenticateJWT from "../middleware/authenticateJWT";
import basicAuth from "../middleware/basicAuth";

const router = express.Router();

router.post("/pet", authenticateJWT, createPet);
router.get("/pets", authenticateJWT, getUserPets);
router.get("/allPets", basicAuth, getAllPets);
router.put("/pet", authenticateJWT, updatePet);
router.delete("/pet", authenticateJWT, deletePet);

export default router;
