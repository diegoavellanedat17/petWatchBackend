import express from "express";
import {
  createPetController,
  getUserPetsController,
  getAllPetsController,
  updatePetController,
  deletePetController,
  getPetByIdController,
} from "../controllers/petController";
import authenticateJWT from "../middleware/authenticateJWT";
import basicAuth from "../middleware/basicAuth";

const router = express.Router();

router.post("/pet", authenticateJWT, createPetController);
router.get("/pets", authenticateJWT, getUserPetsController);
router.get("/allPets", basicAuth, getAllPetsController);
router.put("/pet/:petId", authenticateJWT, updatePetController);
router.delete("/pet/:petId", authenticateJWT, deletePetController);
router.get("/pet/:petId", authenticateJWT, getPetByIdController);

export default router;
