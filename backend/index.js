import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRouter from "./src/routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./src/routes/user.route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(
  cors({
    origin: "https://ai-virtual-assistant-mern-1-nbk0.onrender.com", 
    credentials: true,
  })
);
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)


const port = process.env.PORT || 5000;

app.listen(port, () => {
  connectDB();
  console.log(`Server is running at port ${port}`);
});
