// controllers/api/client_controller.js

import { client_service } from '../../services/client_service.js';

export const client_controller = {
    create_client: async (req, res) => {
        try {
            let { name, redirect_uri, grant_types, scope, active, company_name, company_id } = req.body;
            active = active === 'on' ? true : false;

            // Validate input
            if (!name || !redirect_uri || !grant_types || !scope || !company_name || !company_id) {
                return res.status(400).json({ error: 'Invalid input' });
            }
            
            const client = await client_service.create_client(name, redirect_uri, grant_types, scope, active, company_name, company_id );
            res.status(200).json(client);
        } 
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error occurred while creating the client.', error: error.message, stack: error.stack });
        }
    },
}