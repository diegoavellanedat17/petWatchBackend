import express from "express";
import {
  register,
  confirmRegistration,
  login,
  getCurrentUser,
  logout,
  deleteUserByIdController,
  getAllUsersController,
  getUserByCognitoIdController,
} from "../controllers/authController";
import authenticateJWT from "../middleware/authenticateJWT";
import basicAuth from "../middleware/basicAuth";

const router = express.Router();

router.post("/register", register);
router.post("/verificate-code", confirmRegistration);
router.post("/login", login);

router.get("/get-current-user", authenticateJWT, getCurrentUser);
router.post("/logout", authenticateJWT, logout);
router.get(
  "/users/cognito/:cognitoId",
  authenticateJWT,
  getUserByCognitoIdController
);

// Admin Features
router.delete("/users/:id", basicAuth, deleteUserByIdController);
router.get("/users", basicAuth, getAllUsersController);

export default router;
