// controllers/token_controller.js
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { token_service } from '../../services/token/token_service.js';
import Client from '../../models/Client.js';
import Company from '../../models/Company.js';

import AuthorizationCode from '../../models/AuthorizationCode.js';

export const token_controller = {
    // Temporare token for create a company
    get_temp_token: async (req, res) => {
        const { company_id } = req.body;

        if (!company_id) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        const company = await Company.findByPk(company_id);

        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }
        
        const temp_token = await token_service.get_temp_token(company_id);
        res.json({ temp_token: temp_token });
    },

    verify_token: async (req, res, next) => {
        const token = req.headers['authorization'].split(' ')[1]; // Extract the token from the 'Authorization' header

        const is_valid = await token_service.verify_token(token);

        if (is_valid) {
            next();
        } 
        else {
            res.status(401).json({ message: 'Token is invalid or expired' });
        }
    },

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
        const { code, redirect_uri, grant_type } = req.body;
        const auth_header = req.headers.authorization;
        const auth_parts = auth_header.split(' ');

        const [client_id, client_secret] = Buffer.from(auth_parts[1], 'base64').toString().split(':');

        try {
            const { token, refresh_token } = await token_service.exchange_code_for_token(code, client_id, client_secret, redirect_uri);
            res.cookie('access_token', token, { httpOnly: true, secure: true });
            res.cookie('refresh_token', refresh_token, { httpOnly: true, secure: true });
        
            res.status(200).json({ access_token: token, refresh_token: refresh_token });
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

    revoke_token: async (req, res) => {
        try {
            const auth_header = req.header('Authorization');
            if (!auth_header) {
                return res.status(401).json({ error: 'Authorization header is required' });
            }

            const token = auth_header.replace('Bearer ', '');        
            await token_service.revoke_token(token);
            res.status(200).json({ message: 'Token revoked successfully' });
        } 
        catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    },
};