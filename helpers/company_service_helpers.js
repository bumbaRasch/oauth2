// helpers/company_service_helpers.js
import { Op } from 'sequelize';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const company_service_helpers = {
  check_username_exists: async (username, current_username) => {
    if (username === current_username) {
      throw new Error('New username cannot be the same as the current username');
    }
    const username_exists = await User.findOne({ where: { username } });
    if (username_exists) {
      throw new Error('Username already in use');
    }
  },

  check_new_company: async (company_id, current_company_id) => {
    if (company_id === current_company_id) {
        throw new Error('New company id cannot be the same as the current company id');
    }
    const new_company = await Company.findByPk(company_id);
    if (!new_company) {
        throw new Error('New company not found');
    }
  },

  check_email_exists: async (email, current_email) => {
    if (email === current_email) {
        throw new Error('New email cannot be the same as the current email');
    }
    const email_exists = await User.findOne({ where: { email } });
    if (email_exists) {
        throw new Error('Email already in use');
    }
  },

  hash_password: async (password) => {
    const salt_rounds = 10;
    const hashed_password = await bcrypt.hash(password, salt_rounds);
    return hashed_password;
  },

  check_same_password: async (user, password) => {
    const is_same_password = await bcrypt.compare(password, user.password);
    if (is_same_password) {
        throw new Error('New password cannot be the same as the old password');
    }
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