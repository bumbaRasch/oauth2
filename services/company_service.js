// service/company_service.js
import { Op } from 'sequelize';
import Company  from '../models/Company.js';
import bcrypt from 'bcryptjs';
import company_service_helpers from '../helpers/company_service_helpers.js';

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