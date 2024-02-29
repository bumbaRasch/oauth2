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


router.get('/oidc/authorize', auth_middleware.authenticate_user, async (req, res) => {
    const { client_id, redirect_uri, response_type, scope, state } = req.query;
    if (!client_id) {
        return res.status(400).json({ error: 'client_id is required' });
    }

    if (!redirect_uri) {
        return res.status(400).json({ error: 'redirect_uri is required' });
    }

    if (!response_type) {
        return res.status(400).json({ error: 'response_type is required' });
    } 
    else if (response_type !== 'code') {
        return res.status(400).json({ error: 'Invalid response_type. Only "code" is supported' });
    }

    if (!scope) {
        return res.status(400).json({ error: 'scope is required' });
    }

    if (!state) {
        return res.status(400).json({ error: 'state is required' });
    }

    const client = await Client.findByPk( client_id );
    if (!client) {
        return res.status(400).json({ error: 'Invalid client_id' });
    }

    if (!client.active) {
        return res.status(400).json({ error: 'Client is inactive' });
    }

    const client_scopes = client.scope;
    const requested_scopes = scope.split(' ');

    if (!requested_scopes.every(scope => client_scopes.includes(scope))) {
        return res.status(400).json({ error: 'Invalid scope' });
    }

    // Authenticate user
    if (!req.user) {
        // If the user is not authenticated, redirect them to the login page
        return res.redirect(`/oidc/register?redirect=${encodeURIComponent(req.originalUrl)}`);
    }


    const code = await AuthorizationCode.create({
        client_id: client.client_id,
        user_id: req.user.user_id,
        scope: requested_scopes.join(' '),
        redirect_uri: redirect_uri, // save the redirect_uri
        expires: new Date(Date.now() + 10*60*1000), // set the code to expire in 10 minutes
        used: false, // set used to false initially
    });
    
    // Redirect the user back to the redirect_uri with the code and state
    res.redirect(`${redirect_uri}?code=${code.authorization_code}&state=${state}`);

});

router.post('/oidc/token', async (req, res) => {
    const { code, client_id, client_secret, redirect_uri } = req.body;

    // Validate the input
    if (!code || !client_id || !client_secret || !redirect_uri) {
        return res.status(400).json({ error: 'code, client_id, client_secret, and redirect_uri are required' });
    }

    // Find the client
    const client = await Client.findByPk(client_id);
    if (!client || client.client_secret !== client_secret) { 
        return res.status(400).json({ error: 'Invalid client_id or client_secret' });
    }

    // Find the authorization code
    const auth_code = await AuthorizationCode.findOne({ where: { authorization_code: code } });

    if (!auth_code || auth_code.redirect_uri !== redirect_uri) {  // || auth_code.used || auth_code.expires < new Date()
        return res.status(400).json({ error: 'Invalid or expired code' });
    }

    // Mark the authorization code as used
    auth_code.used = true;
    await auth_code.save();

    // Create and return the access token
    try {
        const { token, refreshToken } = await token_controller.generate_token(code);
        res.json({ access_token: token, token_type: 'Bearer', refresh_token: refreshToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;