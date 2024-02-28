// routes/auth_routes.js
import express from 'express';
import { auth_controller } from '../controllers/auth_controller.js';
import { user_controller } from '../controllers/user_controller.js';
import { token_controller } from '../controllers/token/token_controller.js'; // import the token controller
import Client  from '../models/Client.js';

const router = express.Router();


router.get('/oidc/authorize', async (req, res) => {
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
        return res.redirect(`/oidc/login?redirect=${encodeURIComponent(req.originalUrl)}`);
    }

    console.log(req.query);
});


router.get('/oidc/login', (req, res) => {
    // Render the login form
    res.send('login');
});

router.post('/oidc/login', async (req, res) => {
    // Authenticate the user
    const user = await authenticateUser(req.body.username, req.body.password);
    if (user) {
        // If the user is authenticated, set req.user and redirect them to the original page
        req.user = user;
        const redirectUrl = req.query.redirect ? decodeURIComponent(req.query.redirect) : '/';
        res.redirect(redirectUrl);
    } else {
        // If the user is not authenticated, show an error message
        res.render('login', { error: 'Invalid username or password' });
    }
});


export default router;