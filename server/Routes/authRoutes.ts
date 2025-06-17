import { signUpUser } from "../controller/authController";
import { Router } from "express";
const router = Router();
//register new user
router.post("/signup", signUpUser);
export default router;