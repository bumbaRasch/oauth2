// helpers/company_service_helpers.js
import { Op } from 'sequelize';
import User from '../models/User.js';

export const company_service_helpers = {
    get_users: async (where, page = 1, page_size = 10) => {
        page      = parseInt(page, 10) || 1;
        page_size = parseInt(page_size, 10) || 10;
        const users = await User.findAll({ 
          where,
          offset: (page - 1) * page_size,
          limit: page_size
        });
        return users;
    },
    
    build_where_clause: (company_uuid, query, is_exact_match = false) => {
        const where = { company_id: company_uuid };
        if (query.name) {
          where.username = is_exact_match ? query.name : { [Op.like]: `%${query.name}%` };
        }
        if (query.email) {
          where.email = is_exact_match ? query.email : { [Op.like]: `%${query.email}%` };
        }
        return where;
    },      
}

export default company_service_helpers;