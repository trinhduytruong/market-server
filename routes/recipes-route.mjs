import { Router } from "express";
import recipeController from "../controllers/recipesController.mjs";
const router = Router();

router.get('/' , recipeController.getAll)
router.patch('/update/:id' , recipeController.edit)
router.post('/create' , recipeController.create)
router.delete('/delete/:id' , recipeController.delete)

export default router