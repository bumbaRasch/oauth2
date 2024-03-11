// routes/auth_routes.js
import express from 'express';
import { validation_middleware } from '../middlewares/validation_middleware.js';
import { auth_controller } from '../controllers/auth_controller.js';
import { user_controller } from '../controllers/user_controller.js';
import { token_controller } from '../controllers/token/token_controller.js'; // import the token controller
import { company_service } from '../services/company_service.js';
import Client  from '../models/Client.js';
import { generate_random_string } from '../utils/generate.js';
import { auth_middleware } from '../middlewares/auth_middleware.js';
const router = express.Router();


router.get('/oidc/register', user_controller.get_user_register);
router.post('/oidc/register', validation_middleware.validate_registration_input ,user_controller.register);

router.get('/oidc/login', user_controller.get_user_login);
router.post('/oidc/login', user_controller.login)


router.get('/oidc/consent', auth_middleware.authenticate, user_controller.get_consent);

router.post('/oidc/consent', auth_middleware.authenticate, user_controller.post_consent);

router.get('/callback', token_controller.exchange_code_for_token);




router.post('/logout', user_controller.logout);
router.post('/password-reset', user_controller.request_password_reset);
router.post('/password-reset/:token', user_controller.reset_password);
router.post('/verify-mfa', user_controller.verifyMfa);
router.post('/update-secret-key', user_controller.update_secret_key);

// Add routes for token generation and refresh
// router.post('/token', token_controller.generate_token);
// router.post('/token/refresh', token_controller.refresh_token);

export default router;



