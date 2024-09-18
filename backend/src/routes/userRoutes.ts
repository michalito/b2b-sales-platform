import express from 'express';
import * as userController from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/register', userController.register);
router.post('/verify-email', userController.verifyEmail);
router.post('/login', userController.login);
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);

// // Protected routes
// router.get('/profile', authenticate, userController.getProfile);
// router.put('/profile', authenticate, userController.updateProfile);

// Admin-only routes
router.get('/all', authenticate, authorize(['ADMIN']), userController.getAllUsers);
router.post('/approve/:userId', authenticate, authorize(['ADMIN']), userController.approveUser);
router.delete('/:userId', authenticate, authorize(['ADMIN']), userController.deleteUser);
router.put('/:userId', authenticate, authorize(['ADMIN']), userController.updateUser);

export default router;