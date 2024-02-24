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

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       
        const user = await User.findOne({ where: { user_id: decoded.uuid } });
      
        if (!user) {
            return res.status(401).json({ error: 'Please authenticate' });
        }
        req.user = user;
        next();
    } catch (err) {
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
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const company = await Company.findOne({ where: { uuid: decoded.company_uuid } });
            if (!company) {
                return res.status(401).json({ error: 'Please authenticate' });
            }
            req.company = company;
            next();
        } catch (err) {
            res.status(500).json({ error: 'Failed to authenticate company' });
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
};