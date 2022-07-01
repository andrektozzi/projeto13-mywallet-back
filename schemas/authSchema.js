import joi from "joi";

export const authSignUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required()
});

export const authLoginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});