import express from 'express';
import AdminController from '../controllers/adminController.js'; 

const router = express.Router();

router.route('/').post(AdminController.createAdmin);
router.route('/:id').get(AdminController.getAdmin);
router.route('/:id').put(AdminController.updateAdmin);
router.route('/:id').delete(AdminController.deleteAdmin);

export default router;