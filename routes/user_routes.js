// routes/auth_routes.js
import express from 'express';
import { validation_middleware } from '../middlewares/validation_middleware.js';
import { auth_controller } from '../controllers/auth_controller.js';
import { user_controller } from '../controllers/user_controller.js';
import { token_controller } from '../controllers/token/token_controller.js'; // import the token controller

const router = express.Router();

router.post('/register', validation_middleware.validate_registration_input ,user_controller.register);
router.post('/login', user_controller.login);

router.post('/logout', user_controller.logout);
router.post('/password-reset', user_controller.request_password_reset);
router.post('/password-reset/:token', user_controller.reset_password);
router.post('/verify-mfa', user_controller.verifyMfa);
router.post('/update-secret-key', user_controller.update_secret_key);

// Add routes for token generation and refresh
router.post('/token', token_controller.generate_token);
router.post('/token/refresh', token_controller.refresh_token);

export default router;



