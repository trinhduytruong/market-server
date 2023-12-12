import { Router } from "express";
import familyGroupController from "../controllers/family-gruopController.mjs";

const router = Router();
router.get('/' , familyGroupController.getAll)
router.patch('/update/:id' , familyGroupController.edit)
router.post('/create' , familyGroupController.create)
router.delete('/delete/:id' , familyGroupController.delete)
router.post('/addmember' , familyGroupController.addMember)
router.get('/:id', familyGroupController.getById )

export default router