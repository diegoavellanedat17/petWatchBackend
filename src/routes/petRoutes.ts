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

router.post("/users/:userId/pets", authenticateJWT, createPet);
router.get("/users/:userId/pets", authenticateJWT, getUserPets);
router.get("/pets", basicAuth, getAllPets);
router.put("/pets/:petId", authenticateJWT, updatePet);
router.delete("/pets/:petId", authenticateJWT, deletePet);

export default router;
