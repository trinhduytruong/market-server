import { Router } from "express";
import categoryController from "../controllers/categoryController.mjs";

const router = Router();

router.get('/' , categoryController.getAll)
router.patch('/update/:id' , categoryController.edit)
router.post('/create' , categoryController.create)
router.delete('/delete/:id' , categoryController.delete)

export default router