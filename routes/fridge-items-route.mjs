import { Router } from "express";

import fridgeItemController from "../controllers/fridge-items.mjs";

const router = Router();

router.get('/' , fridgeItemController.getAll)
router.patch('/update/:id' , fridgeItemController.edit)
router.post('/create' , fridgeItemController.create)
router.delete('/delete/:id' , fridgeItemController.delete)


export default router