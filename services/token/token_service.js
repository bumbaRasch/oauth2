// services/token_service.js
import jwt from 'jsonwebtoken';
import Client from '../../models/Client.js';
import AuthorizationCode from '../../models/AuthorizationCode.js';
import User from '../../models/User.js';
import Company from '../../models/Company.js';
import BlacklistToken from '../../models/BlacklistToken.js';


export const token_service = {
    get_temp_token: async (company_id) => {

        if (!company_id) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        const company = await Company.findByPk(company_id);

        if (!company) {
            throw new Error('Company not found');
        }

        const temp_token = jwt.sign({ company_id: company_id }, process.env.JWT_SECRET || 'jwt_secret', { expiresIn: process.env.JWT_TTL || '1h' });
        return temp_token;
    },

    find_token: (headers, cookies, body, query) => {
        let token = null;

        if (headers['authorization']) {
            token = headers['authorization'].split(' ')[1];
        }
    
        // Check custom header, came from the client
        if (!token && headers['X-Custom-Token']) {
            token = headers['X-Custom-Token'];
        }
    
        if (!token) {
            token = cookies['token'];
        }
    
        if (!token) {
            token = body['token'];
        }
    
        if (!token) {
            token = query['token'];
        }
        
        if (!token) {
            throw new Error('Token is required');
        }
    
        return token;
    },

    verify_token: async (token) => {
        try {

            const blacklisted_token = await BlacklistToken.findOne({ where: { token: token } });
            if (blacklisted_token) {
                throw new Error('Token has been revoked');
            }
            jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret');
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
        
        //body token
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

        if (!code || !client_id || !client_secret || !redirect_uri) {
            throw new Error('code, client_id, client_secret, and redirect_uri are required');
        }

        const client = await Client.findByPk(client_id);

        if (!client || client.client_secret !== client_secret) { 
            throw new Error('Invalid client_id or client_secret');
        }

        const auth_code = await AuthorizationCode.findOne({ where: { authorization_code: code } });

        // redirect_uri must redirect_uri from the client (in Form from created Client)
        // if (!auth_code || auth_code.redirect_uri !== redirect_uri) { // || auth_code.used || auth_code.expires < new Date()
        //     throw new Error('Invalid or expired code');
        // }

        auth_code.used = true;        
        await auth_code.save();

        const token         = jwt.sign({ user_id: auth_code.user_id, company_id: client.company_id }, process.env.JWT_SECRET || 'jwt_secret', { expiresIn: process.env.JWT_TTL || '1h' })
        const refresh_token = jwt.sign({ user_id: auth_code.user_id, company_id: client.company_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        return { token, refresh_token };
    },

    refresh_token: async (refresh_token) => {
        try {
            const decoded    = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
            const user_id    = decoded.user_id;
            const company_id = decoded.company_id;

            const newToken        = jwt.sign({ user_id: user_id, company_id: company_id }, process.env.JWT_SECRET || 'jwt_secret', { expiresIn: process.env.JWT_TTL || '1h' });
            const newRefreshToken = jwt.sign({ user_id: user_id, company_id: company_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            return { access_token: newToken, refresh_token: newRefreshToken };
        } 
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    },

    revoke_token: async (token) => {
        try {
            const existing_token = await BlacklistToken.findOne({ where: { token: token } });
    
            if (!existing_token) {
                await BlacklistToken.create({ token: token, last_active: new Date()});
            }
    
            return true;
        } 
        catch (error) {
            console.error(error);
            throw new Error('Failed to revoke token');
        }
    },
    
};