import { AddIncome, AddExpense, ListTransactions } from "../controllers/transactionsControllers.js";
import { TokenMiddleware } from "../middlewares/tokenMiddleware.js";
import { ValidateTransaction } from "../middlewares/schemaMiddleware.js";
import { Router } from "express";

const router = Router();

router.post("/entradas", TokenMiddleware, ValidateTransaction, AddIncome);
router.post("/saidas", TokenMiddleware, ValidateTransaction, AddExpense);
router.get("/transacoes", TokenMiddleware, ListTransactions);

export default router;