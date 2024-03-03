// controllers/token_controller.js
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { token_service } from '../../services/token/token_service.js';
import Client from '../../models/Client.js';

export const token_controller = {
    // Basic authentication
    check_token: async (req, res) => {
        const auth_header = req.headers.authorization;

        if (!auth_header) {
            return res.status(400).json({ error: 'Authorization header is required' });
        }

        const auth_parts = auth_header.split(' ');

        if(auth_parts.length !== 2 || auth_parts[0] !== 'Basic') {
            return res.status(400).json({ error: 'Invalid authorization header format. Format is "Basic base64encoded(client_id:client_secret)"' });
        }

        const [client_id, client_secret] = Buffer.from(auth_parts[1], 'base64').toString().split(':');

        // Проверяем учетные данные клиента
        const client = await Client.findOne({ where: { client_id: client_id, client_secret: client_secret } });
        if (!client) {
            return res.status(401).json({ error: 'Invalid client credentials' });
        }

        const token = req.body.token;

        const decoded = jwt.decode(token);

        if (!decoded) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        const user_id = decoded.user_id;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const is_valid = await token_service.verify_token(token, user.secret_key);

        if (is_valid) {
            res.status(200).json({ active: true });
        } 
        else {
            res.status(401).json({ active: false });
        }
    },

    // Bearer authentication code exchange to token
    exchange_code_for_token: async (req, res) => {

        const { code, client_id, client_secret, redirect_uri } = req.body;
        console.log('code: ', code);

        try {
            const { token, refreshToken } = await token_service.exchange_code_for_token(code, client_id, client_secret, redirect_uri);
            res.json({ access_token: token, token_type: 'Bearer', refresh_token: refreshToken });
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