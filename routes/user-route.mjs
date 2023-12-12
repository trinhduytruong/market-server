import { Router } from "express";
import userController from "../controllers/userController.mjs";
const router = Router();


router.get('/' , userController.getAll)
router.get('/:id' , userController.getById)

router.delete('/delete/:id',  userController.delete)


router.patch('/update/:id' ,  userController.edit)

router.post('/register' , userController.create)

router.post('/login' , userController.login)
router.post('/addtocart/:userId' , userController.addToCart)
router.get('/cart/:userId', userController.getCart)
router.delete('/cart/remove/:userId', userController.removeFromCart);

export default router
