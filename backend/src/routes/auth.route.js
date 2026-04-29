import express from "express";
import { Signin, Signout, Signup } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", Signup);
authRouter.post("/signin", Signin);
authRouter.get("/signout", Signout);

export default authRouter;
