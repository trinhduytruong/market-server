import { Router } from "express";
import familyGroupController from "../controllers/family-groupController.mjs";

const router = Router();
router.get('/' , familyGroupController.getAll)
router.patch('/update/:id' , familyGroupController.edit)
router.post('/create' , familyGroupController.create)
router.delete('/delete/:id' , familyGroupController.delete)
router.post('/addmember' , familyGroupController.addMember)
router.get('/:id', familyGroupController.getById )
router.get('/getlistitem/:groupId' , familyGroupController.getListItem)
router.get('/getrecipes/:groupId' , familyGroupController.getRecipesForFamily)
router.delete('/deletemember' , familyGroupController.removeMember)

export default router