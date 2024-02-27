// service/auth_service.js
import jwt from 'jsonwebtoken';
import Company from '../models/Company.js';
import User from '../models/User.js';

export const auth_service = {
    
    is_company_owner: async (userUuid, companyUuid) => {
        const user = await User.findByPk(userUuid);
               
        if (!user) {
            throw new Error('User not found');
        }
        return user.company_id === companyUuid;
    },
};