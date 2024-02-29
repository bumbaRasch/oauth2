// services/token_service.js
import jwt from 'jsonwebtoken';
import Client from '../../models/User.js';
import AuthorizationCode from '../../models/AuthorizationCode.js';


export const token_service = {
    verify_token: async (token, user_secret_key) => {
        try {
            jwt.verify(token, user_secret_key);
            return true;
        } 
        catch (error) {
          return false;
        }
    },

    generate_token: async (code) => {
        const auth_code = await AuthorizationCode.findOne({ where: { authorization_code: code } });
        if (!auth_code) {
            throw new Error('Invalid authorization code');
        }
    
        const user = await Client.findByPk(auth_code.user_id);
        if (!user) {
            throw new Error('No user found with that ID');
        }
    
        const token        = jwt.sign({ uuid: user.uuid, company_uuid: user.company_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TTL || '1h' })
        const refreshToken = jwt.sign({ uuid: user.uuid, company_uuid: user.company_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    
        return { token, refreshToken };
    },

    refresh_token: async (uuid, company_uuid) => {
        const user = await Client.findOne({ where: { uuid: uuid, company_id: company_uuid } });

        if (!user) {
            throw new Error('Access is forbidden');
        }

        const token = jwt.sign({ uuid: user.uuid, company_uuid: user.company_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TTL || '1h' });
        return token;
    },
};