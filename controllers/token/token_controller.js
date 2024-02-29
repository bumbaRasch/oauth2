// controllers/token_controller.js
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { token_service } from '../../services/token/token_service.js';

export const token_controller = {
    check_token: async (req, res) => {

        const auth_рeader = req.headers.authorization;

        if (!auth_рeader) {
            return res.status(400).json({ error: 'Authorization header is required' });
        }

        const token_parts = auth_рeader.split(' ');

        if(token_parts.length !== 2 || token_parts[0] !== 'Bearer') {
            return res.status(400).json({ error: 'Invalid authorization header format. Format is "Bearer token"' });
        }

        const token = token_parts[1];
        const decoded = jwt.decode(token);

        if (!decoded) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        const user_id = decoded.user_id;
       
        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const is_valid = await token_service.verify_token(token);
    
        if (is_valid) {
            res.status(200).json({ active: true });
        } 
        else {
            res.status(401).json({ active: false });
        }
    },

    exchange_code_for_token: async (req, res) => {

        const { code, client_id, client_secret, redirect_uri } = req.body;

        try {
            const { token, refreshToken } = await token_service.exchange_code_for_token(code, client_id, client_secret, redirect_uri);
            res.json({ access_token: token, token_type: 'Bearer', refresh_token: refreshToken });
            // Send email to user !
        } 
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};