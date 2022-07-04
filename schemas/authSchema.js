import joi from "joi";

export const authSignUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    confirmPassword: joi.any().valid(joi.ref("password")).required()
});

export const authLoginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});