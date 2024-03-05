//controllers/company/company_controller.js
import { company_service } from '../../services/company_service.js';

export const company_controller = {
  create: async (req, res) => {
      try {
        const company = await company_service.create(req.body);
        res.redirect(`/register/client?company_id=${company.company_id}`); 
      } 
      catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

  get_company: async (req, res) => {
      try {
          const company = await company_service.get_company(req.params.uuid);
          res.json(company);
      } 
      catch (error) {
          res.status(500).json({ error: error.message });
      }
  },

  get_companies: async (req, res) => {
    try  {
      const page      = req.query.page      !== undefined ? Number(req.query.page) : process.env.PAGE || 1;
      const page_size = req.query.page_size !== undefined ? Number(req.query.page_size) : process.env.PAGE_SIZE || 10;
      const companies = await company_service.get_companies(page, page_size);
      res.json(companies);
    }
    catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
      try {
      const result = await company_service.update(req.params.uuid, req.body);
      res.json(result);
      } 
      catch (error) {
          res.status(500).json({ error: error.message });
      }
  },

  delete: async (req, res) => {
      try {
          const result = await company_service.delete(req.params.uuid);
          res.json(result);
      } 
      catch (error) {
          res.status(500).json({ error: error.message });
      }
  },

  get_company_users: async (req, res) => {
    try {
      const page = Number(req.query.page);
      const page_size = Number(req.query.page_size);
      const users = await company_service.get_company_users(req.params.uuid, page, page_size);
      res.json(users);
    } 
    catch (error) {
      res.status(500).json({ error: error.message });
    }
},

  add_user_to_company: async (req, res) => {
    try {
      const { uuid } = req.params;
      const { username, password, email } = req.body; // full_name removed
      const user = await company_service.add_user_to_company(uuid, { username, password, email });
      res.status(201).json(user);
    } 
    catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update_user_in_company: async (req, res) => {
    try {
      const { uuid, user_uuid } = req.params;
      const user_updates = req.body;
      await company_service.update_user_in_company(uuid, user_uuid, user_updates);
      res.status(200).json({ message: 'User successfully updated in the company' });
    } 
    catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  remove_user_from_company: async (req, res) => {
    try {
      const { uuid, user_uuid } = req.params;
      await company_service.remove_user_from_company(uuid, user_uuid);
      res.status(200).json({ message: 'User successfully removed from company' });
    } 
    catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  search_company_users: async (req, res) => {
    try {
      const page = Number(req.query.page);
      const page_size = Number(req.query.page_size);
      const users = await company_service.search_company_users(req.params.uuid, req.query, page, page_size);
      res.json(users);
    } 
    catch (error) {
      res.status(500).json({ error: error.message });
    }
},

  filter_company_users: async (req, res) => {
    try {
      const page = Number(req.query.page);
      const page_size = Number(req.query.page_size);
      const users = await company_service.filter_company_users(req.params.uuid, req.query, page, page_size);
      res.json(users);
    } 
    catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
}

export default company_controller;