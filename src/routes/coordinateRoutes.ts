import { Router } from "express";
import {
  createCoordinate,
  fetchPetCoordinates,
  createAppCoordinate,
} from "../controllers/coordinateController";
import authenticateJWT from "../middleware/authenticateJWT";
import basicAuth from "../middleware/basicAuth";

const router = Router();

router.post("/coordinates/:petId", authenticateJWT, createCoordinate);
router.get("/coordinates/:petId", authenticateJWT, fetchPetCoordinates);

router.post("/coordinates/app/:petId", basicAuth, createAppCoordinate);
export default router;
