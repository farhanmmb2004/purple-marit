import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    refreshAccessToken,
    getUserProfile,
    updateUserProfile,
    changePassword,
    getAllUsers,
    activateUser,
    deactivateUser
} from "../controllers/user.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// ============ PUBLIC ROUTES ============
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// ============ PROTECTED ROUTES (USER) ============
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/profile").get(verifyJWT, getUserProfile);
router.route("/profile").patch(verifyJWT, updateUserProfile);
router.route("/change-password").post(verifyJWT, changePassword);

// ============ PROTECTED ROUTES (ADMIN) ============
router.route("/admin/users").get(verifyJWT, verifyAdmin, getAllUsers);
router.route("/admin/users/:userId/activate").patch(verifyJWT, verifyAdmin, activateUser);
router.route("/admin/users/:userId/deactivate").patch(verifyJWT, verifyAdmin, deactivateUser);

export default router;