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


router.get('/oidc/authorize',  auth_middleware.authenticate_user, async (req, res) => {
    const { client_id, redirect_uri, response_type, scope, state } = req.query;

    try {
        if (!client_id) {
            return res.status(400).json({ error: 'client_id is required' });
        }

        if (!redirect_uri) {
            return res.status(400).json({ error: 'redirect_uri is required' });
        }

        if (!response_type) {
            return res.status(400).json({ error: 'response_type is required' });
        } else if (response_type !== 'code') { // Add more conditions here if you want to support other response types
            return res.status(400).json({ error: 'Invalid response_type. Only "code" is supported' });
        }

        if (!scope) {
            return res.status(400).json({ error: 'scope is required' });
        }

        if (!state) {
            return res.status(400).json({ error: 'state is required' });
        }

        const client = await Client.findByPk(client_id);

        if (!client) {
            return res.status(400).json({ error: 'Invalid client_id' });
        }

        if (!client.active) {
            return res.status(400).json({ error: 'Client is inactive' });
        }

        if (client.redirect_uri !== redirect_uri) {
            return res.status(400).json({ error: 'Invalid redirect_uri' });
        }

        const client_scopes = client.scope;
        const requested_scopes = scope.split(' ');

        if (!requested_scopes.every(requested_scope => client_scopes.includes(requested_scope))) {
            return res.status(400).json({ error: 'Invalid scope' });
        }

    
        // Authenticate user
        if (!req.user) {
            // If the user is not authenticated, redirect them to the login page
            return res.redirect(`/oidc/login?redirect=${encodeURIComponent(req.originalUrl)}`);
        }

        // Create an authorization code
        const code = await AuthorizationCode.create({
            client_id: client.client_id,
            user_id: req.user.user_id,
            scope: requested_scopes.join(' '),
            redirect_uri: redirect_uri, // save the redirect_uri
            expires: new Date(Date.now() + 15 * 60 * 1000), // set the code to expire in 15 minutes
            used: false, // set used to false initially
        });
        
        console.log('code', code);

        // Redirect the user back to the redirect_uri with the code and state
        res.redirect(`${redirect_uri}?code=${code.authorization_code}&state=${state}`);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/oidc/token', token_controller.exchange_code_for_token);

export default router;