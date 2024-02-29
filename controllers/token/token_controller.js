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

    

    generate_token: async (code) => {
        try {
            return await token_service.generate_token(code);
        } 
        catch (err) {
            throw new Error('Failed to generate token');
        }
    },

    refresh_token: async (req, res) => {
        const { uuid, company_uuid } = req;

        try {
            const token = await token_service.refresh_token(uuid, company_uuid);
            return res.json({ token });
        } 
        catch (err) {
            return res.status(500).json({ error: 'Failed to refresh token' });
        }
    },
};