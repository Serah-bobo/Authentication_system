import { signUpUser,loginUser,logoutUser } from "../controller/authController";
import {refreshAccessToken} from '../controller/refreshTokenController'
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
export default router;