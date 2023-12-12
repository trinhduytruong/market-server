import { Router } from "express";
import shoppingListController from "../controllers/shopping-list.mjs";
const router = Router();

router.get('/' , shoppingListController.getAll)
router.patch('/update/:id' , shoppingListController.edit)
router.post('/create' , shoppingListController.create)
router.delete('/delete/:id' , shoppingListController.delete)
router.post('createitem' , shoppingListController.addItem)

export default router