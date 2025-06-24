import { signUpUser,loginUser,logoutUser } from "../controller/authController";
import {refreshAccessToken} from '../controller/refreshTokenController'
import { verifyEmail } from "../controller/authController";
import {verify2FA} from '../controller/authController'
import { forgotPassword } from "../controller/authController";
import { resetPassword } from "../controller/authController";
import { Router } from "express";
const router = Router();
//register new user
router.post("/signup", signUpUser);
//login user
router.post("/login", loginUser);
//logout user
router.post("/logout", logoutUser);
//refresh access token
router.get("/refresh", refreshAccessToken);
//verify email
router.get("/verify-email/:token", verifyEmail);
//verify 2FA
router.post("/verify-2fa", verify2FA);
//forgot password
router.post("/forgot-password", forgotPassword);
//reset password
router.post("/reset-password/:token", resetPassword);
export default router;
