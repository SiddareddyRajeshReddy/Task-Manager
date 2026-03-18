import { Router } from 'express';
import { signup, login, getMe } from './auth.controller.js';
import { signupValidators, loginValidators } from './auth.validators.js';
import protect from '../middleware/protect.js';

const router = Router();

router.post('/signup', signupValidators, signup);
router.post('/login',  loginValidators,  login);
router.get('/me',      protect,          getMe);

export default router;