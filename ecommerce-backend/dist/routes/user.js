import express from 'express';
import { deleteUser, getAllUsers, getUserDetail, newUser } from '../controllers/user.js';
import { adminOnly } from '../middlewares/auth.js';
const router = express.Router();
//route /api/v1/user/new
router.post('/new', newUser);
//route /api/v1/user/all
router.get('/all', adminOnly, getAllUsers);
//route /api/v1/user/:dynamicID
router.route('/:id')
    .get(getUserDetail)
    .delete(adminOnly, deleteUser);
export default router;
