import { Router } from "express";
import {
  joinUs,
  getPotentialUsers,
} from "../controllers/potentialUserController";
import basicAuth from "../middleware/basicAuth";

const router = Router();

router.post("/join-us", basicAuth, joinUs);
router.get("/potential-users", basicAuth, getPotentialUsers);

export default router;
