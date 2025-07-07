import express from 'express';
import { getActions } from '../controllers/actionController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', auth, getActions);

export default router;
