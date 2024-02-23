// controllers/token_controller.js
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

export const token_controller = {
    generate_token: async (req, res) => {
        const { uuid, companyUuid } = req.body;

        try {
            const user = await User.findOne({ where: { uuid: uuid, company_id: companyUuid } });

            if (!user) {
                return res.status(400).json({ error: 'No user found with that UUID and Company UUID' });
            }

            const token = jwt.sign({ uuid: user.uuid, companyUuid: user.company_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ uuid: user.uuid, companyUuid: user.company_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            res.json({ token, refreshToken });
        } 
        catch (err) {
            res.status(500).json({ error: 'Failed to generate token' });
        }
    },

    refresh_token: async (req, res) => {
        const { uuid, companyUuid } = req;

        try {
            const user = await User.findOne({ where: { uuid: uuid, company_id: companyUuid } });

            if (!user) {
                return res.status(403).json({ error: 'Access is forbidden' });
            }

            const newToken = jwt.sign({ uuid: user.uuid, companyUuid: user.company_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token: newToken });
        } 
        catch (err) {
            return res.status(500).json({ error: 'Failed to refresh token' });
        }
    },
};