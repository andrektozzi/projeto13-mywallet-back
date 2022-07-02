import { db, objectId } from "../db/mongo.js";
import dayjs from "dayjs";

export async function AddIncome(req, res) {

    const { value, description, type } = req.body;
    const { user } = res.locals;
    const date = dayjs().format("DD/MM");

    try {
        await db.collection("transactions").insertOne({
            value,
            description,
            type,
            date,
            userId: new objectId(user._id)
        });
        res.sendStatus(201);

    } catch (error) {
        res.sendStatus(500);
    }
}

export async function AddExpense(req, res) {
    
    const { value, description, type} = req.body;
    const { user } = res.locals;
    const date = dayjs().format("DD/MM");

    try {
        const transactions = await db.collection("transactions").insertOne({
            value,
            description,
            type,
            date,
            userId: new objectId(user._id)
        });
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
}

export async function ListTransactions(req, res) {
    
    const { user } = res.locals;

    try {
        const transactions = await db.collection("transactions").find({ userId: new objectId(user._id)} ).toArray();
        res.send(transactions);

    } catch (error) {
        res.sendStatus(500);
    }
}