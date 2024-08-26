import express from "express";
import {
  register,
  confirmRegistration,
  login,
  getCurrentUser,
  logout,
  deleteUserById,
  getAllUsers,
  getUserByCognitoId,
} from "../controllers/authController";
import authenticateJWT from "../middleware/authenticateJWT";
import basicAuth from "../middleware/basicAuth";

const router = express.Router();

router.post("/register", register);
router.post("/verificate-code", confirmRegistration);
router.post("/login", login);

router.get("/get-current-user", authenticateJWT, getCurrentUser);
router.post("/logout", authenticateJWT, logout);
router.get("/users/cognito/:cognitoId", authenticateJWT, getUserByCognitoId);

// Admin Features
router.delete("/users/:id", basicAuth, deleteUserById);
router.get("/users", basicAuth, getAllUsers);

export default router;
