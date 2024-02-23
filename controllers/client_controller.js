// controllers/client_controller.js
import Client from '../models/Client.js';
import crypto from 'crypto';


export const client_controller = {
    register_client: async (req, res) => {
        const { redirect_uri, grant_types, scope, user_id } = req.body;
        
        /*
        // Validate the request
        {
            "redirect_uri": "http://myapp.com/callback",
            "grant_types": ["authorization_code", "refresh_token"],
            "scope": ["read", "write"],
            "user_id": "123"
        }

        */

        // Generate a new client_id and client_secret
        const client_id = crypto.randomBytes(20).toString('hex');
        const client_secret = crypto.randomBytes(40).toString('hex');

        try {
            const client = await Client.create({
                client_id,
                client_secret,
                redirect_uri,
                grant_types,
                scope,
                user_id,
                active: true
            });

            res.status(201).json({
                message: 'Client registered successfully',
                client_id: client.client_id,
                client_secret: client.client_secret,
            });
        } catch (error) {
            console.log(error);
            res.status(400).send({ error: 'Error registering client' });
        }
    },
    get_client: async (req, res) => {
        const { clientId } = req.params;
        
        const client = await Client.findOne({ where: { client_id: clientId } });

        if (!client) {
            return res.status(404).send({ error: 'Client not found' });
        }

        res.send({ clientId: client.client_id, clientSecret: client.client_secret });
    }
};