import { Router } from "express";
import {
  createCoordinate,
  fetchPetCoordinates,
} from "../controllers/coordinateController";
import authenticateJWT from "../middleware/authenticateJWT";

const router = Router();

router.post("/coordinates/:petId", authenticateJWT, createCoordinate);
router.get("/coordinates/:petId", authenticateJWT, fetchPetCoordinates);

export default router;
