import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,smartAssign
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/', protect, createTask);
router.get('/', protect, getAllTasks);
router.get('/:id', protect, getTaskById);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.post('/:id/smart-assign', protect, smartAssign);

export default router;
