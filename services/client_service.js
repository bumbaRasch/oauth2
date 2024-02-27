// services/client_service.js
import Client from "../models/Client.js";
import Company from "../models/Company.js";
import { generate_random_string } from "../utils/generate.js";
import company_service_helpers from "../helpers/company_service_helpers.js";

export const client_service = {
    create_client: async (company_id, name, redirect_uri, grant_types, scope, active) => {
        // Check if company_id is provided
        if (!company_id) {
            throw new Error('company_id is required');
        }
        // Check if the company exists
        const company = await Company.findByPk(company_id);
        if (!company) {
            throw new Error('Company not found');
        }

        const password = generate_random_string(16);
        const client_secret = await company_service_helpers.hash_password(password);
        const client = await Client.create({ client_secret, company_id, name, redirect_uri, grant_types, scope, active });
        await client.save();
        return { client_id: client.client_id, client_secret: client.client_secret, company_id: client.company_id, name: client.name, redirect_uri: client.redirect_uri, grant_types: client.grant_types, scope: client.scope, active: client.active };
    },

    get_all_clients: async () => {
        const clients = await Client.findAll();
        return clients;
    },

    get_one_client: async (client_id) => {
        const client = await Client.findOne({ where: { client_id } });
        if (!client) {
            throw new Error('Client not found');
        }
        return client;
    },

    update_client: async (client_id, updates) => {
        console.log('updates', updates);
        const client = await Client.findOne({ where: { client_id } });
        if (!client) {
            throw new Error('Client not found');
        }
        await client.update(updates);
        return client;
    },

    delete_client: async (client_id) => {
        const client = await Client.findOne({ where: { client_id } });
        if (!client) {
            throw new Error('Client not found');
        }
        await client.destroy();
    }
};
    
    