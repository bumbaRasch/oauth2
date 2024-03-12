// routes/auth_routes.js
import express from 'express';
import { auth_controller } from '../controllers/auth_controller.js';
import { user_controller } from '../controllers/user_controller.js';
import { token_controller } from '../controllers/token/token_controller.js'; // import the token controller
import { validation_middleware } from '../middlewares/validation_middleware.js';
import { auth_middleware } from '../middlewares/auth_middleware.js';


const router = express.Router();

router.get('/oidc/authorize', auth_middleware.authenticate_session, auth_controller.authorize);
router.post('/oidc/token', auth_middleware.authenticate_session, token_controller.exchange_code_for_token);
router.post('/oidc/check_token', token_controller.check_token);
router.post('/oidc/refresh_token', auth_middleware.authenticate_session, token_controller.refresh_token);

export default router;