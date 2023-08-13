import { Router } from "express";
import { validateSchema } from "../middlewares/validadeSchema.js";
import { validateAuth } from "../middlewares/validadeAuth.js";
import { getMiauById, getMiaus } from "../controllers/miaus.controller.js";

const miauRouter = Router();

miauRouter.get('/home', validateAuth, getMiaus);
miauRouter.get('/miau/:id', validateAuth, getMiauById);

export default miauRouter;