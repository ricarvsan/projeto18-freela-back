import Joi from "joi"

export const registerSchema = Joi.object({
    name: Joi.string().required(),
    cpf: Joi.string().trim().length(14).pattern(/\d{3}\.\d{3}\.\d{3}-\d{2}/).required(),
    email: Joi.string().email().required(),
    phonenumber: Joi.string().trim().min(10).max(15).pattern(/^([(])[0-9]{2}([)])([ ])[\s]?[0-9]{5}[-]?[0-9]{4}$/).required(),
    password: Joi.string().required().min(3),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3)
});