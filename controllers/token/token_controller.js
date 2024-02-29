// controllers/token_controller.js
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { token_service } from '../../services/token/token_service.js';

export const token_controller = {
    check_token: async (req, res) => {
        const token = req.body.token;
        const user_id = jwt.decode(token).uuid;
        console.log(user_id);

        
        const user = await User.findOne({ where: { user_id: user_id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(user.secret_key);
        const is_valid = await token_service.verify_token(token, user.secret_key);
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