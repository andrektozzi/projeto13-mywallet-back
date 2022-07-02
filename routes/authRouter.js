import { CreateUser, LoginUser, LogoutUser } from "../controllers/authControllers.js";
import { TokenMiddleware } from "../middlewares/tokenMiddleware.js";
import { ValidateSignUp, ValidateLogin } from "../middlewares/schemaMiddleware.js";
import { Router } from "express";

const router = Router();

router.post("/cadastro", ValidateSignUp, CreateUser);
router.post("/login", ValidateLogin, LoginUser);
router.get("/sair", TokenMiddleware, LogoutUser);

export default router;