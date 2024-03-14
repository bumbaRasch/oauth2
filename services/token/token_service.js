// services/token_service.js
import jwt from 'jsonwebtoken';
import Client from '../../models/Client.js';
import AuthorizationCode from '../../models/AuthorizationCode.js';
import User from '../../models/User.js';
import BlacklistToken from '../../models/BlacklistToken.js';


export const token_service = {
    verify_token: async (token) => {
        try {
            const blacklisted_token = await BlacklistToken.findOne({ where: { token: token } });
            
            if (blacklisted_token) {
                throw new Error('Token has been revoked');
            }
            jwt.verify(token, process.env.JWT_SECRET);
            return true;
        } 
        catch (error) {
            return false;
        }
    },


    // Basic authentication
    check_token: async (auth_header, token) => {
        if (!auth_header) {
            throw { status: 400, message: 'Authorization header is required' };
        }

        const auth_parts = auth_header.split(' ');

        if(auth_parts.length !== 2 || auth_parts[0] !== 'Basic') {
            throw { status: 400, message: 'Invalid authorization header format. Format is "Basic base64encoded(client_id:client_secret)"' };
        }

        const [client_id, client_secret] = Buffer.from(auth_parts[1], 'base64').toString().split(':');

        const client = await Client.findOne({ where: { client_id: client_id, client_secret: client_secret } });
        if (!client) {
            throw { status: 401, message: 'Invalid client credentials' };
        }

        const decoded = jwt.decode(token);

        if (!decoded) {
            throw { status: 400, message: 'Invalid token' };
        }

        const user_id = decoded.user_id;

        const user = await User.findByPk(user_id);

        if (!user) {
            throw { status: 404, message: 'User not found' };
        }

        const is_valid = await token_service.verify_token(token);

        if (is_valid) {
            return { active: true };
        } 
        else {
            throw { status: 401, message: 'Invalid token' };
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

    revoke_token: async (token) => {
        try {
            const existingToken = await BlacklistToken.findOne({ where: { token: token } });
    
            if (!existingToken) {
                await BlacklistToken.create({ token: token });
            }
    
            return true;
        } 
        catch (error) {
            console.error(error);
            throw new Error('Failed to revoke token');
        }
    },
    
};