// service/company_service.js
import Company  from '../models/Company.js';
import bcrypt from 'bcryptjs';
import company_service_helpers from '../helpers/company_service_helpers.js';
import User from '../models/User.js';
import Client from '../models/Client.js';

export const company_service = {
  create: async (body) => {
    const { name, password, email } = body;
    if (!name || !password || !email) {
      throw new Error('Company name, email, and password are required');
    }
    try {
      // Check if company already exists
      const existing_company = await Company.findOne({ where: { email } });
      if (existing_company) {
        throw new Error('Company with this email already exists');
      }
      const hashed_password = await company_service_helpers.hash_password(password);
          const created = await Company.create({ name, password: hashed_password, email });
          return created; // return only the created company
    } 
    catch (error) {
      throw new Error('Error creating company: ' + error.message);
    }
  },

    get_company: async (uuid) => {
        if (!uuid) {
            throw new Error('Company ID is required');
        }
        try {
            const company = await Company.findByPk(uuid);
            if (!company) {
            throw new Error('Company not found');
            }
            return { message: 'Company retrieved successfully', company: company };
        } 
        catch (error) {
            throw new Error('Error retrieving company: ' + error.message);
        }
    },

    get_companies: async (page = process.env.PAGE || 1, page_size = process.env.PAGE_SIZE || 10) => {
      try {
        page      = parseInt(page, 10);
        page_size = parseInt(page_size, 10) || 10;
        const offset = (page - 1) * page_size;
        return await Company.findAll({ offset, limit: page_size });
      } 
      catch (error) {
        throw new Error('Error retrieving companies: ' + error.message);
      }
    },

    update: async (uuid, body) => {
        try {
          const company = await Company.findByPk(uuid);
          if (!company) {
            throw new Error('Company not found');
          }
          const updated = await company.update(body);
          return updated;
        } 
        catch (error) {
          throw new Error('Error updating company: ' + error.message);
        }
    },
    
    delete: async (uuid) => {
        try {
            const company = await Company.findByPk(uuid);
            if (!company) {
            throw new Error('Company not found');
            }
            await company.destroy();
            return { message: 'Company deleted successfully' };
        } 
        catch (error) {
            throw new Error('Error deleting company: ' + error.message);
        }
    },

    // by default, page = 1 and page_size = 10
    get_company_users: async (company_uuid, page = process.env.PAGE || 1, page_size = process.env.PAGE_SIZE || 10) => {
      try {
        page      = parseInt(page, 10) || 1;
        page_size = parseInt(page_size, 10) || 10;

        const where = { company_id: company_uuid };
        return await company_service_helpers.get_users(where, page, page_size);
      } 
      catch (error) {
        throw new Error('Error retrieving company users: ' + error.message);
      }
    },

    add_user_to_company: async (uuid, userData) => {
      try {
        const company = await Company.findByPk(uuid);
        if (!company) {
          throw new Error('Company not found');
        }
    
        const user = await User.create({
          ...userData,
          company_id: uuid
        });
    
        return user;
      } 
      catch (error) {
        throw new Error('Error adding user to company: ' + error.message);
      }
    },

    update_user_in_company: async (uuid, user_uuid, user_updates) => {
      try {
        const user = await User.findOne({ where: { user_id: user_uuid, company_id: uuid } });
        if (!user) {
          throw new Error('User not found in this company');
        }
    
        if (user_updates.username) {
          const username_error = await company_service_helpers.check_username_exists(user_updates.username, user.username);
          if (username_error) {
            throw new Error(username_error);
          }
        }
    
        if (user_updates.email) {
          const email_error = await company_service_helpers.check_email_exists(user_updates.email, user.email);
          if (email_error) {
            throw new Error(email_error);
          }
        }
    
        if (user_updates.password) {
          const password_error = await company_service_helpers.check_same_password(user, user_updates.password);
          if (password_error) {
            throw new Error(password_error);
          }
          user_updates.password = await company_service_helpers.hash_password(user_updates.password);
        }
    
        for (let key in user_updates) {
          if (user[key] !== undefined) {
            user[key] = user_updates[key];
          }
        }
    
        await user.save();
      } catch (error) {
        throw new Error('Error updating user in company: ' + error.message);
      }
    },

    remove_user_from_company: async (uuid, user_uuid) => {
      try {
        const company = await Company.findByPk(uuid);
        if (!company) {
          throw new Error('Company not found');
        }
    
        const user = await User.findOne({ where: { user_id: user_uuid, company_id: uuid } });
        if (!user) {
          throw new Error('User not found in this company');
        }
    
        user.company_id = null;
        await user.save();
    
      } 
      catch (error) {
        throw new Error('Error removing user from company: ' + error.message);
      }
    },
    
    search_company_users: async (company_uuid, query, page = process.env.PAGE || 1, page_size = process.env.PAGE_SIZE || 10) => {
      try {
        const where = company_service_helpers.build_where_clause(company_uuid, query);
        return await company_service_helpers.get_users(where, page, page_size);
      } 
      catch ({ message }) {
        throw new Error(`Error searching company users: ${message}`);
      }
    },
    
    filter_company_users: async (company_uuid, query, page = process.env.PAGE || 1,  page_size = process.env.PAGE_SIZE || 10) => {
      try {
        const where = company_service_helpers.build_where_clause(company_uuid, query, true);
        return await company_service_helpers.get_users(where, page, page_size);
      } 
      catch ({ message }) {
        throw new Error(`Error filtering company users: ${message}`);
      }
    },
}