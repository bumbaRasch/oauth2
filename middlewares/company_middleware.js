// middlewares/company_middleware.js

import { company_service } from '../services/company_service.js';

export const company_middlewares = {
    company_exists: async (req, res, next) => {
        try {
          const company = await company_service.get_company(req.params.uuid);
          req.company = company;
          next();
        } 
        catch (error) {
          res.status(404).json({ error: error.message });
        }
      },

    validate_update_input: (req, res, next) => {
        const { name } = req.body;
        if (!name) {
          return res.status(400).json({ error: 'Company name is required for update' });
        }
        next();
    },

    check_password: async (req, res, next) => {
        const { password } = req.body;
        if (!password) {
          return res.status(400).json({ error: 'Password is required' });
        }
        const company = await company_service.get_company(req.params.uuid);
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
          return res.status(403).json({ error: 'Invalid password' });
        }
        next();
    },

};
