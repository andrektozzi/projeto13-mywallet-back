import express, { json } from "express";
import cors from "cors";
import joi from "joi";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db = null;

mongoClient.connect().then(() => {
    db = mongoClient.db("my-wallet");
})

app.listen(5000, () => console.log("Servidor rodando!"));

