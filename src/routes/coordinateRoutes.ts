import { Router } from "express";
import {
  createCoordinate,
  fetchAllCoordinates,
} from "../controllers/coordinateController";
import basicAuth from "../middleware/basicAuth";
const router = Router();

router.post("/coordinates", basicAuth, createCoordinate);
router.get("/coordinates", basicAuth, fetchAllCoordinates);

export default router;
