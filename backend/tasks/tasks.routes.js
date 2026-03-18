import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from './tasks.controller.js';
import {
  createTaskValidators,
  updateTaskValidators,
  listTaskValidators,
} from './tasks.validators.js';
import protect from '../middleware/protect.js';

const router = Router();

// All task routes are protected
router.use(protect);

router.get('/',    listTaskValidators,   getTasks);
router.post('/',   createTaskValidators, createTask);
router.patch('/:id', updateTaskValidators, updateTask);
router.delete('/:id',                    deleteTask);

export default router;