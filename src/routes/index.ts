import express from 'express';
import authRoutes from './auth.routes';
import memberRoutes from './member.routes';

const router = express.Router();

// Register all routes
router.use('/auth', authRoutes);
router.use('/members', memberRoutes);

export default router;