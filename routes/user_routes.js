// routes/auth_routes.js
import express from 'express';
import { Op } from 'sequelize';
import { validation_middleware } from '../middlewares/validation_middleware.js';
import { auth_controller } from '../controllers/auth_controller.js';
import { user_controller } from '../controllers/user_controller.js';
import { token_controller } from '../controllers/token/token_controller.js'; // import the token controller
import { company_service } from '../services/company_service.js';
import Client  from '../models/Client.js';
import { generate_random_string } from '../utils/generate.js';
import { auth_middleware } from '../middlewares/auth_middleware.js';
const router = express.Router();


router.get('/oidc/register', async (req, res) => {
    try {
        const companies = await company_service.get_companies();
        res.render('register_user', { companies });
    } 
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/oidc/register', validation_middleware.validate_registration_input ,user_controller.register);

router.get('/oidc/login', (req, res) => {
    res.render('user_login');
})
router.post('/oidc/login', user_controller.login)


router.get('/oidc/consent', auth_middleware.authenticate, async (req, res) => {
    try {
        const user = req.session.user;
       
        // Get the active client associated with the same company as the user
        const client = await Client.findOne({ where: { [Op.and]: [{ company_id: user.company_id }, { active: true }]}});
        
        const state = generate_random_string(16);
        const code_challenge = generate_random_string(32);
        const code_challenge_method = 'S256'; // Or 'plain', depending on your implementation

        // Render the consent page with the client data
        res.render('consent', { client, state, code_challenge, code_challenge_method});
    } 
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/oidc/consent', async (req, res) => {
    try {
        // Redirect the user to the authorization endpoint with the necessary parameters
        const params = new URLSearchParams({
            client_id: req.body.client_id,
            redirect_uri: req.body.redirect_uri,
            response_type: req.body.response_type,
            state: req.body.state,
            scope: req.body.scope,
            code_challenge: req.body.code_challenge, // Add this line
            code_challenge_method: req.body.code_challenge_method, // Add this line
            // Add any other parameters required by your authorization endpoint
        });
        res.redirect(`/oidc/authorize?${params}`);
    } 
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});

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



