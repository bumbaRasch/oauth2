// routes/auth_routes.js
import express from 'express';
import { validation_middleware } from '../middlewares/validation_middleware.js';
import { auth_controller } from '../controllers/auth_controller.js';
import { user_controller } from '../controllers/user_controller.js';
import { token_controller } from '../controllers/token/token_controller.js';
import { auth_middleware } from '../middlewares/auth_middleware.js';
const router = express.Router();


router.get('/oidc/register', user_controller.get_user_register);
router.post('/oidc/register', validation_middleware.validate_registration_input ,user_controller.register);
router.get('/oidc/login', user_controller.get_user_login);
router.post('/oidc/login', user_controller.login)
router.get('/oidc/consent', auth_middleware.authenticate_session, user_controller.get_consent);
router.post('/oidc/consent', auth_middleware.authenticate_session, user_controller.post_consent);
router.get('/callback', auth_middleware.authenticate_session, token_controller.exchange_code_for_token);


// // Revocation Endpoint: Это конечная точка, которую клиенты могут использовать для отзыва токенов доступа или обновления. Это может быть полезно для улучшения безопасности, особенно в случае, если токен доступа утрачен или украден.
router.post('/oidc/revoke', auth_middleware.authenticate_user_with_token, token_controller.revoke_token);

// // Introspection Endpoint: Это конечная точка, которую клиенты могут использовать для получения информации о токене доступа. Это может быть полезно для проверки состояния токена и его свойств.
// router.post('/oidc/introspect', auth_middleware.authenticate_user_with_token, token_controller.introspect_token);

// // User Info Endpoint: Это конечная точка, которую клиенты могут использовать для получения информации о пользователе, связанной с токеном доступа. Это может быть полезно для получения информации о пользователе без необходимости запроса к вашему основному API.
// router.get('/oidc/userinfo', auth_middleware.authenticate_user_with_token, user_controller.user_info);

// // JWKS Endpoint: Это конечная точка, которую клиенты могут использовать для получения открытого ключа для проверки подписи JWT.
// router.get('/.well-known/jwks.json', auth_controller.jwks);

router.post('/logout', user_controller.logout);
router.post('/password-reset', user_controller.request_password_reset);
router.post('/password-reset/:token', user_controller.reset_password);
router.post('/verify-mfa', user_controller.verifyMfa);
router.post('/update-secret-key', user_controller.update_secret_key);

// Add routes for token generation and refresh
// router.post('/token', token_controller.generate_token);
// router.post('/token/refresh', token_controller.refresh_token);

export default router;



