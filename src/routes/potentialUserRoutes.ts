import { Router } from "express";
import {
  joinUs,
  getPotentialUsers,
} from "../controllers/potentialUserController";

const router = Router();

router.post("/join-us", joinUs);
router.get("/potential-users", getPotentialUsers);

export default router;
