import { Router } from "express";
import { signin, signup } from "../controllers/user.controller.js";
import { validateSchema } from "../middlewares/validadeSchema.js";
import { loginSchema, registerSchema } from "../schemas/user.schema.js";

const userRouter = Router();

userRouter.post('/cadastro', validateSchema(registerSchema), signup);
userRouter.post('/', validateSchema(loginSchema), signin);

export default userRouter;