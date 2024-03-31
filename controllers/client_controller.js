// controllers/client_controller.js
import Client from '../models/Client.js';
import crypto from 'crypto';
import { client_service } from '../services/client_service.js';
import { company_service } from '../services/company_service.js';
import jwt from 'jsonwebtoken';


export const client_controller = {
    create_client: async (req, res) => {
        try {
            let { name, redirect_uri, grant_types, scope, active, company_name, company_id } = req.body;
            active = active === 'on' ? true : false;

            const { company_id: cookie_company_id, temp_token: cookie_temp_token } = req.cookies;
            
            // Check that the company_id and temp_token match the cookies
            if (cookie_company_id !== company_id || cookie_temp_token !== req.cookies.temp_token) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const client = await client_service.create_client(name, redirect_uri, grant_types, scope, active, company_name, company_id );

            const token = jwt.sign({ client_id: client.client_id, client_secret: client.client_secret },  process.env.JWT_SECRET_CLIENT || 'jwt_secret', { expiresIn: process.env.JWT_TTL || '1h' });

            // Delete the company_id and temp_token cookies
            res.cookie('company_id', '', { expires: new Date(0) });
            res.cookie('token', '', { expires: new Date(0) });

            // Set the JWT token as a secure HTTP-only cookie
            res.cookie('token', token, { httpOnly: true, secure: true })
            
            res.redirect(`${ process.env.WEBSITE_URL || 'http://localhost:5000' }/views/choice/user`);
        } 
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error occurred while creating the client.', error: error.message, stack: error.stack });
        }
    },

    register_client: async (req, res, next) => {
        try {
            const company = req.company;
            res.render('register_client', { company: company });
        } 
        catch (error) {
            res.status(500).send(error.message);
        }
    },

    get_one_client: async (req, res) => {
        try {
            const { client_id } = req.params;
            const client = await client_service.get_one_client(client_id);
            res.status(200).json(client);
        } catch (error) {
            res.status(500).json({ message: 'Error occurred while retrieving the client.' });
        }
    },

    get_all_clients: async (req, res) => {
        try {
            const clients = await client_service.get_all_clients();
            res.status(200).json(clients);
        } 
        catch (error) {
            res.status(500).json({ message: 'Error occurred while retrieving clients.' });
        }
    },
    
    update_client: async (req, res) => {
        try {
            const { client_id } = req.params;
            const updates = req.body;
            const client = await client_service.update_client(client_id, updates);
            res.status(200).json(client);
        } 
        catch (error) {
            console.error(error); // log the error
            res.status(500).json({ message: 'Error occurred while updating the client.' });
        }
    },

    delete_client: async (req, res) => {
        try {
            const { client_id } = req.params;
            await client_service.delete_client(client_id);
            res.status(204).send();
        } 
        catch (error) {
            res.status(500).json({ message: 'Error occurred while deleting the client.' });
        }
    },
};