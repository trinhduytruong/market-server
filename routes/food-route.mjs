import { Router } from "express";
import foodController from "../controllers/foodController.mjs";


const router = Router();

router.get('/' , foodController.getAll)
router.patch('/update/:id' , foodController.edit)
router.post('/create' , foodController.create)
router.delete('/delete/:id' , foodController.delete)
router.get('/:categoryId' , foodController.getByCategoryId)
router.get('/detail/:id' , foodController.getById)
router.post('/search', foodController.search);

export default router