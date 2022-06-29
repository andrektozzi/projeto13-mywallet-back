import express, { json } from "express";
import cors from "cors";
import joi from "joi";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db = null;

mongoClient.connect().then(() => {
    db = mongoClient.db("my-wallet");
});

app.post("/cadastro", async (req, res) => {
    
    const cadastroSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.string().required()
    });

    const usuario = req.body
    const { name, email, password, confirmPassword } = req.body;
    const validacao = cadastroSchema.validate(
        { name, email, password, confirmPassword }, { abortEarly: false }
    );

    if(validacao.error) {
        return res.sendStatus(422)
    }

    const senhaHash = bcrypt.hashSync(password, 10);

    try {
        const usuarioExiste = await db.collection("usuarios").findOne({ email });

        if(usuarioExiste) {
            return res.sendStatus(409);
        }

        await db.collection("usuarios").insertOne({ ...usuario, password: senhaHash });

        return res.sendStatus(201);

    } catch (error) {
        res.sendStatus(500);
    }
});

app.post("/login", async (req,res) => {
    
    const loginSchema = joi.object({
        email: joi.string().required(),
        password: joi.string().required()
    });

    const { email, password } = req.body;
    const validacao = loginSchema.validate(
        { email, password }, { abortEarly: false }
    );

    if(validacao.error) {
        return res.sendStatus(422);
    }

    try {
        const usuario = await db.collection("usuarios").findOne({ email });

        if(!usuario || password !== usuario.password) {
            return res.sendStatus(403);
        }

        return res.sendStatus(200);

    } catch (error) {
        res.sendStatus(500)
    }

});


app.listen(5000, () => console.log("Servidor rodando!"));

