// routes/auth_routes.js
import express from 'express';
import { auth_controller } from '../controllers/auth_controller.js';
import { user_controller } from '../controllers/user_controller.js';
import { token_controller } from '../controllers/token/token_controller.js'; // import the token controller

const router = express.Router();


router.get('/authorize', auth_controller.authorize);

export default router;