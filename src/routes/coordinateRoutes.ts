import { Router } from "express";
import {
  createCoordinate,
  fetchAllCoordinates,
} from "../controllers/coordinateController";

const router = Router();

router.post("/coordinates", createCoordinate);
router.get("/coordinates", fetchAllCoordinates);

export default router;
