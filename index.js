import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { CreateUser, LoginUser, LogoutUser } from "./controllers/authControllers.js";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.post("/cadastro", CreateUser);

app.post("/login", LoginUser);

app.get("/sair", LogoutUser);

app.post("/entradas", async (req, res) => {
    const { authorization } = req.headers;
    const { value, description } = req.body;
    const token = authorization?.replace("Bearer ", "");

    const entradasSchema = joi.object({
        value: joi.number().required(),
        description: joi.string().required()
    });

    const validacao = entradasSchema.validate( { value, description }, { abortEarly: false });

    if(validacao.error) {
        return res.sendStatus(422);
    }

    try {
        const sessao = await db.collection("sessoes").findOne({ token });

        if(!sessao) {
            return res.sendStatus(401);
        }

        const transacoes = await db.collection("transacoes").insertOne({
            value,
            description,
            userId: sessao.userId
        });
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
});

app.post("/saidas", async (req, res) => {
    const { authorization } = req.headers;
    const { value, description, type } = req.body;
    const data = dayjs().format("DD/MM");
    const token = authorization?.replace("Bearer ", "");

    const saidasSchema = joi.object({
        value: joi.number().required(),
        description: joi.string().required(),
        type: joi.string().valid("saidas").required
    });

    const validacao = saidasSchema.validate({ value, description, type }, { aboutEarly: false });

    if(validacao.error) {
        return res.sendStatus(422);
    }

    try {
        const sessao = await db.collection("sessoes").findOne({ token });

        if(!sessao) {
            return res.sendStatus(401);
        }

        const transacoes = await db.collection("transacoes").insertOne({
            value,
            description,
            type,
            date,
            userId: sessao.userId
        });

        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
})

app.get("/transacoes", async (req,res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    try {
        const sessao = await db.collection("sessoes").findOne({ token });

        if(!sessao) {
            return res.sendStatus(401);
        }

        const transacoes = await db.collection("transacoes").find({ userId: new ObjectId(sessao.userId)}).toArray();
        res.send(transacoes);
    } catch (error) {
        res.sendStatus(500);
    }
});



app.listen(5000, () => console.log("Servidor rodando!"));

