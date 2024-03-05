// services/token_service.js
import jwt from 'jsonwebtoken';
import Client from '../../models/Client.js';
import AuthorizationCode from '../../models/AuthorizationCode.js';


export const token_service = {
    verify_token: async (token) => {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            return true;
        } 
        catch (error) {
            return false;
        }
    },
    exchange_code_for_token: async (code, client_id, client_secret, redirect_uri) => {
        // Validate the input
        if (!code || !client_id || !client_secret || !redirect_uri) {
            throw new Error('code, client_id, client_secret, and redirect_uri are required');
        }

        // Find the client
        const client = await Client.findByPk(client_id);

        if (!client || client.client_secret !== client_secret) { 
            throw new Error('Invalid client_id or client_secret');
        }

        // Find the authorization code
        const auth_code = await AuthorizationCode.findOne({ where: { authorization_code: code } });

        if (!auth_code || auth_code.redirect_uri !== redirect_uri) { // || auth_code.used || auth_code.expires < new Date()
            throw new Error('Invalid or expired code');
        }

        // Mark the authorization code as used
        auth_code.used = true;
        await auth_code.save();

        // Create and return the access token
        const token        = jwt.sign({ user_id: auth_code.user_id, company_id: client.company_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TTL || '1h' })
        const refreshToken = jwt.sign({ user_id: auth_code.user_id, company_id: client.company_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        return { token, refreshToken };
    },

    refresh_token: async (refresh_token) => {
        try {
            const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
            const user_id = decoded.user_id;
            const company_id = decoded.company_id;

            const newToken = jwt.sign({ user_id: user_id, company_id: company_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TTL || '1h' });
            const newRefreshToken = jwt.sign({ user_id: user_id, company_id: company_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            return { access_token: newToken, refresh_token: newRefreshToken };
        } 
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    },
};