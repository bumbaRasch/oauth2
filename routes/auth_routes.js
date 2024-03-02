// routes/auth_routes.js
import express from 'express';
import { auth_controller } from '../controllers/auth_controller.js';
import { user_controller } from '../controllers/user_controller.js';
import { token_controller } from '../controllers/token/token_controller.js'; // import the token controller
import { validation_middleware } from '../middlewares/validation_middleware.js';
import { auth_middleware } from '../middlewares/auth_middleware.js';
import Client  from '../models/Client.js';
import AuthorizationCode from '../models/AuthorizationCode.js';

const router = express.Router();

router.get('/oidc/authorize', auth_middleware.authenticate_user, auth_controller.authorize);
router.post('/oidc/token', token_controller.exchange_code_for_token);

export default router;