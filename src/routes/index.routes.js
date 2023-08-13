import { Router } from "express";
import userRouter from "./user.routes.js";
import miauRouter from "./miau.routes.js";


const router = Router();

router.use(userRouter);
router.use(miauRouter);

export default router;