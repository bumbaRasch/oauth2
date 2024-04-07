// controllers/api/client_controller.js

import { client_service } from '../../services/client_service.js';
import { token_service } from '../../services/token/token_service.js';

export const client_controller = {
    create_temporary_client: async (req, res) => {
        const client = req.body;
        try {
            const client_created = await client_service.create_temporary_client(client);
            const token = await token_service.generate_token({ client_id: client_created.client_id, company_id: client_created.company_id });
            res.status(200).json({ client_created, token });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error occurred while creating the temporary client.' });
        }
    },

    confirm_temporary_client: async (req, res) => {
        const { client_id, company_id } = req.token;
        try {
            const client = await client_service.confirm_temporary_client(client_id, company_id);
            res.status(200).json({ message: 'Temporary client successfully confirmed' });
        } 
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    create_client: async (req, res) => {
        try {
            let { name, redirect_uri, grant_types, scope, active, company_name, company_id } = req.body;
            active = active === 'on' || active === true ? true : false;

            // Validate input
            if (!name || !redirect_uri || !grant_types || !scope || !company_name || !company_id) {
                return res.status(400).json({ error: 'Invalid input' });
            }

            const client = await client_service.create_client(name, redirect_uri, grant_types, scope, active, company_name, company_id );

            const token = await token_service.generate_token({ client_id: client.client_id, company_id: client.company_id });
           
            res.status(200).json({ client: client, token: token });
        } 
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error occurred while creating the client.', error: error.message, stack: error.stack });
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
}