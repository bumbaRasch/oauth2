// controllers/client_controller.js
import Client from '../models/Client.js';
import crypto from 'crypto';
import { client_service } from '../services/client_service.js';
import { company_service } from '../services/company_service.js';


export const client_controller = {
    create_client: async (req, res) => {
        try {
            let { name, redirect_uri, grant_types, scope, active, company_name, company_id } = req.body;
            active = active === 'on' ? true : false;
            console.log(req.body)
            const client = await client_service.create_client(name, redirect_uri, grant_types, scope, active, company_name, company_id );
            res.redirect('/oidc/login');
        } 
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error occurred while creating the client.', error: error.message, stack: error.stack });
        }
    },

    register_client: async (req, res, next) => {
        try {
            const companies = await company_service.get_companies();
            const selected_company_id = req.query.company_id;
            res.render('register_client', { companies, selected_company_id });
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