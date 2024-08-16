import express from "express";
import {
  register,
  confirmRegistration,
  login,
  getCurrentUser,
  logout,
} from "../controllers/authController";
import authenticateJWT from "../middleware/authenticateJWT";

const router = express.Router();

router.post("/register", register);
router.post("/verificate-code", confirmRegistration);
router.post("/login", login);

router.get("/get-current-user", authenticateJWT, getCurrentUser);
router.post("/logout", authenticateJWT, logout);

export default router;
