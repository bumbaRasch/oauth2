// service/company_service.js
import { Op } from 'sequelize';
import Company  from '../models/Company.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';


export const company_service = {
    create: async (body) => {
        const { name, password, email } = body;
        if (!name || !password || !email) {
          throw new Error('Company name, email, and password are required');
        }
        try {
          const hashed_password = await bcrypt.hash(password, 10); // hash the password
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
    get_company_users: async (company_uuid, page = 1, page_size = 10) => {
      try {
        const users = await User.findAll({ 
          where: { company_id: company_uuid },
          offset: (page - 1) * page_size,
          limit: page_size
        });
        return users;
      } 
      catch (error) {
        throw new Error('Error retrieving company users: ' + error.message);
      }
    },
    
    search_company_users: async (company_uuid, query, page = 1, page_size = 10) => {
      try {
        const where = { company_id: company_uuid };
        if (query.name) {
          where.username = { [Op.like]: `%${query.name}%` };
        }
        if (query.email) {
          where.email = { [Op.like]: `%${query.email}%` };
        }
        const users = await User.findAll({ 
          where,
          offset: (page - 1) * page_size,
          limit: page_size
        });
        return users;
      } 
      catch (error) {
        throw new Error('Error searching company users: ' + error.message);
      }
    },

    filter_company_users: async (company_uuid, query, page = 1, page_size = 10) => {
      try {
        const where = { company_id: company_uuid };
        if (query.name) {
          where.username = query.name;
        }
        if (query.email) {
          where.email = query.email;
        }
        // Set page and page_size to their default values if they are undefined
        page = page || 1;
        page_size = page_size || 10;
        // Parse page and page_size as integers
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(page_size, 10);
        const users = await User.findAll({ 
          where,
          offset: (pageNumber - 1) * pageSize,
          limit: pageSize
        });
        return users;
      } 
      catch (error) {
        throw new Error('Error filtering company users: ' + error.message);
      }
    },
}