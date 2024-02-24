// middlewares/auth_middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Client from '../models/Client.js';
import Company from '../models/Company.js';
import { auth_service } from '../services/auth_service.js';

export const auth_middleware = {
    authenticate_user: async (req, res, next) => {
        try {
          const token = req.header('Authorization').replace('Bearer ', '');
          const decoded = jwt.decode(token); // Decode the token without verifying it to get the user ID
    
          const user = await User.findOne({ where: { user_id: decoded.uuid } });
          if (!user) {
            return res.status(401).json({ error: 'Please authenticate' });
          }

          jwt.verify(token, user.secret_key); // Now verify the token with the user's secret key
    
          req.user = user;
          console.log(req.user); // Add this line to debug
          next();
        } catch (err) {
          console.error(err); // Add this line to debug
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
        } catch (err) {
            res.status(500).json({ error: 'Failed to authenticate client' });
        }
    },

    authenticate_company: async (req, res, next) => {
        try {
          const token = req.header('Authorization').replace('Bearer ', '');
          const decoded = jwt.decode(token); // Decode the token without verifying it to get the user ID
    
          const user = await User.findOne({ where: { user_id: decoded.uuid } });
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

    authorize_admin: async (req, res, next) => {
      const userUuid = req.user.uuid;

      if (await auth_service.is_admin(userUuid)) {
          next();
      } 
      else {
          res.status(403).json({ error: 'Access is forbidden' });
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

  authorize_roles: (allowed_permissions) => {
    return (req, res, next) => {
      const user_permissions = req.user.permissions;
      if (allowed_permissions.some(permission => user_permissions.includes(permission))) {
        next();
      } else {
        res.status(403).json({ message: `User does not have the required permissions to perform this action.` });
      }
    }
  }
};