// middlewares/auth_middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Client from '../models/Client.js';
import Company from '../models/Company.js';
import { auth_service } from '../services/auth_service.js';
import { verify_token_with_authorization_server } from '../utils/verify_token_with_authorization_server.js';

export const auth_middleware = {
  authenticate: async (req, res, next) => {
    try {
      if (req.session && req.session.user_id) {
       
        const user = await User.findByPk(req.session.user_id);
        
        if (user) {
            res.locals.user = user; // Save user in res.locals
            next();
        } 
        else {
            res.status(401).json({ error: 'Unauthorized' });
        }
      } 
      else {
        res.status(401).json({ error: 'Unauthorized' });
      }
    } 
    catch (err) {
      res.status(500).json({ error: 'Failed to authenticate user' });
    }
  },
  
    authenticate_user: async (req, res, next) => {
    try {
      const auth_header = req.header('Authorization');
      if (!auth_header) {
        return res.status(401).json({ error: 'Authorization header is required' });
      }

      const token = auth_header.replace('Bearer ', '');
     
      console.log('token', token);
      let decoded;
      try {
        decoded = jwt.decode(token);
      } 
      catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const user = await User.findOne({ where: { user_id: decoded.user_id } });
      if (!user) {
        return res.status(401).json({ error: 'Please authenticate' });
      }

      const company = await Company.findOne({ where: { company_id: user.company_id } });
      if (!company) {
        return res.status(401).json({ error: 'Company not found' });
      }

      const client = await Client.findOne({ where: { company_id: company.company_id } });
      if (!client) {
        return res.status(401).json({ error: 'Client not found' });
      }

      let is_valid;
      try {
        is_valid = await verify_token_with_authorization_server(token,client.client_id, client.client_secret);
      } 
      catch (err) {
        return res.status(500).json({ error: 'Failed to verify token with authorization server' });
      }

      if (!is_valid) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      req.user = user;
      next();
    } 
    catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to authenticate user' });
    }
  },

  authenticate_client: async (req, res, next) => {
      try {
          const token = req.header('Authorization').replace('Bearer ', '');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const client = await Client.findOne({ where: { uuid: decoded.client_uuid } });
          if (!client) {
              return res.status(401).json({ error: 'Please authenticate' });
          }
          req.client = client;
          next();
      } 
      catch (err) {
          res.status(500).json({ error: 'Failed to authenticate client' });
      }
  },

  authenticate_company: async (req, res, next) => {
      try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.decode(token); // Decode the token without verifying it to get the user ID
  
        const user = await User.findOne({ where: { user_id: decoded.user_id } });
        if (!user) {
          return res.status(401).json({ error: 'Please authenticate' });
        }
        
  
        jwt.verify(token, user.secret_key); // Now verify the token with the user's secret key
  
        const company = await Company.findOne({ where: { company_id: user.company_id } });
        if (!company) {
          return res.status(401).json({ error: 'Company not found' });
        }
  
        req.user = user;
        req.company = company;
      
        next();
      } 
      catch (err) {
        res.status(500).json({ error: 'Failed to authenticate user', message: err.message });
      }
    },

  authorize_company: async (req, res, next) => {
    try {
      if (await auth_service.is_company_owner(req.user.dataValues.user_id, req.company.dataValues.company_id)) {
          next();
      } 
      else {
          res.status(403).json({ error: 'Access is forbidden' });
      }
    }
    catch (err) {
      res.status(500).json({ error: 'Failed to authorize company' });
    }
  },

  authorize_roles: (allowed_roles) => {
    return (req, res, next) => {
      const user_roles = JSON.parse(req.user.roles);
      if (allowed_roles.some(role => user_roles.includes(role))) {
        next();
      } 
      else {
        res.status(403).json({ message: `User does not have the required roles to perform this action.` });
      }
    }
  },

  authorize_permissions: (allowed_permissions) => {
    return (req, res, next) => {
      const user_permissions = JSON.parse(req.user.permissions);
      if (allowed_permissions.some(permission => user_permissions.includes(permission))) {
        next();
      } 
      else {
        res.status(403).json({ message: `User does not have the required permissions to perform this action.` });
      }
    }
  }
};