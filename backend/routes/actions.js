import express from 'express';
import { getAllActions } from '../controllers/actionController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', auth, getAllActions);

export default router;
