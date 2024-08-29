import express from "express";
import {
  createPet,
  getUserPets,
  getAllPets,
  updatePet,
  deletePet,
  getPet,
} from "../controllers/petController";
import authenticateJWT from "../middleware/authenticateJWT";
import basicAuth from "../middleware/basicAuth";

const router = express.Router();

router.post("/pet", authenticateJWT, createPet);
router.get("/pets", authenticateJWT, getUserPets);
router.get("/allPets", basicAuth, getAllPets);
router.put("/pet/:petId", authenticateJWT, updatePet);
router.delete("/pet/:petId", authenticateJWT, deletePet);
router.get("/pet/:petId", authenticateJWT, getPet);

export default router;
