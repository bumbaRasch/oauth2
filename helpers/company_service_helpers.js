// helpers/company_service_helpers.js
import { Op } from 'sequelize';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const company_service_helpers = {
    check_new_company: async (company_id) => {
      const new_company = await Company.findByPk(company_id);
      if (!new_company) {
        throw new Error('New company not found');
      }
    },

    check_email_exists: async (email) => {
      const email_exists = await User.findOne({ where: { email } });
      if (email_exists) {
          throw new Error('Email already in use');
      }
    },

    hash_password: async (password) => {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    },
    
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