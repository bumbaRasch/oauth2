// controllers/token_controller.js
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { token_service } from '../../services/token/token_service.js';
import Client from '../../models/Client.js';
import AuthorizationCode from '../../models/AuthorizationCode.js';

export const token_controller = {
    // Basic authentication
    check_token: async (req, res) => {
        try {
            const result = await token_service.check_token(req.headers.authorization, req.body.token);
            res.status(200).json(result);
        } 
        catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    },

    // Bearer authentication code exchange to token
    exchange_code_for_token: async (req, res) => {

        const { code, state,} =  req.query;
        const auth_code = await AuthorizationCode.findOne({ where: { authorization_code: code } });
        if (!auth_code) {
            return res.status(400).json({ error: 'Authorization code not found' });
        }
        const client = await Client.findByPk(auth_code.client_id);
        if (!client) {
            return res.status(400).json({ error: 'Client not found' });
        }

        try {
            const { token, refreshToken } = await token_service.exchange_code_for_token(code, client.client_id, client.client_secret, client.redirect_uri);
            // Render the callback view with the access token and state
            res.render('callback', { access_token: token, state, refreshToken: refreshToken });
            // Send email to user !
        } 
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    refresh_token: async (req, res) => {
        const auth_header = req.headers.authorization;
        if (!auth_header) {
            return res.status(401).json({ error: 'Authorization header is required' });
        }
    
        const auth_parts = auth_header.split(' ');
        if (auth_parts.length !== 2 || auth_parts[0] !== 'Bearer') {
            return res.status(401).json({ error: 'Invalid authorization header format. Format is "Bearer refreshToken"' });
        }
    
        const refresh_token = auth_parts[1];
    
        try {
            const newTokens = await token_service.refresh_token(refresh_token);
            res.json(newTokens);
        } 
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};