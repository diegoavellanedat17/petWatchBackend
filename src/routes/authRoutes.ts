import express from "express";
import {
  register,
  confirmRegistration,
  login,
  getCurrentUser,
  logout,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/verificate-code", confirmRegistration);
router.post("/login", login);
router.get("/get-current-user", getCurrentUser);
router.post("/logout", logout);

export default router;
