// service/company_service.js
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

    get_company_users: async (company_uuid) => {
      const users = await User.findAll({ where: { company_id: company_uuid } });
      return users;
    },
}