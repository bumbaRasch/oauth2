//controllers/company/company_controller.js
import { company_service } from '../../services/company_service.js';

export const company_controller = {
  create: async (req, res) => {
      try {
        const company = await company_service.create(req.body);
        res.status(201).json(company);
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