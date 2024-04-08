// services/client_service.js
import { Op, where } from "sequelize";
import Client from "../models/Client.js";
import Company from "../models/Company.js";
import { generate_random_string } from "../utils/generate.js";
import validators from "../utils/validators.js";
import { email_service } from "./email/email_service.js";
import sequelize  from '../models/sequelize.js';

export const client_service = {
    create_temporary_client: async (client) => {
        if (typeof client !== 'object') {
            throw new Error('Client must be an object');
        }
        if (!client.client_name || !client.redirect_uri || !client.grant_types || !client.scope || !client.company_id) {
           throw new Error('client_name, redirect_uri, grant_types, scope, and company_id are required');
        }
        return await Client.create({...client, status: 'unconfirmed' , last_active: new Date()});
    },

    confirm_temporary_client: async (client_id, company_id) => {

        // Check if client_id and company_id are valid UUIDs
        validators.validate_uuids(client_id, company_id);

        const client = await Client.findByPk(client_id);
        if (!client || client.company_id != company_id) {
            throw new Error('Client not found or does not belong to this company');
        }

        // Update client status and last active date
        await client.update({
            status: 'confirmed',
            last_active: new Date()
        });

        return client.reload();
    },

    create_client_app: async (client_id, company_id) => {
        const transaction = await sequelize.transaction();
        try {
            validators.validate_uuids(client_id, company_id);
            
            const client = await Client.findOne({ where: { client_id, company_id } });

            // if (!client || client.status !== 'confirmed' || Date.now() - client.last_active.getTime() > 15 * 60 * 1000) {
            //     throw new Error('Client not confirmed within the required timeframe.');
            // }

            await client.update({
                status: 'active',
                last_active: new Date()
            });
    
            await transaction.commit();
    
            return client;
    
        }
        catch (error) {
            await transaction.rollback();
            throw new Error(`Error creating client: ${error.message}`);
        }
    },

    create_client: async ( name, redirect_uri, grant_types, scope, active, company_name, company_id ) => {
        const transaction = await sequelize.transaction();
        try {
            // Check if company_id is provided
            if (!company_id) {
                throw new Error('company_id is required');
            }
            // Check if the company exists
            const company = await Company.findByPk(company_id);
            if (!company) {
                throw new Error('Company not found');
            }
            // Check if the company name matches the provided company_name
            if (company.name != company_name) {
                throw new Error('Company name does not match the provided company_id');
            }
            // Check if a client with the same name or redirect_uri already exists
            const existing_client = await Client.findOne({ where: { company_id, [Op.or]: [{ name }, { redirect_uri }] } });
            if (existing_client) {
                throw new Error('A client with the same name or redirect_uri already exists for this company');
            }
 
            const client_secret = generate_random_string(16);
            const client = await Client.create({ client_secret, company_id, name, redirect_uri, grant_types, scope, active, last_active: new Date() });

            await client.save({ transaction });

            const html_content = `
                <h1>Welcome to Our Service</h1>
                <p>Dear user,</p>
                <p>Thank you for signing up for our service. We are excited to have you on board.</p>
                <p>Your Client with name ${name}</p>
                <p>Your OAuth2 client has been created with the following details:</p>
                <ul>
                    <li>Client ID: ${client.client_id}</li>
                    <li>Client Secret: ${client_secret}</li>
                    <li>Redirect URI: ${client.redirect_uri}</li>
                    <li>Grant Types: ${client.grant_types}</li>
                    <li>Scope: ${client.scope}</li>
                </ul>
                <img src="https://example.com/path-to-your-logo.png" alt="Our Logo" />
                <p>Best Regards,</p>
                <p>Your Company Name</p>
            `;

            await email_service.send_email(company.email, 'Welcome!', html_content);
            
            await transaction.commit();
            return { client_id: client.client_id, client_secret: client.client_secret, company_id: client.company_id, name: client.name, redirect_uri: client.redirect_uri, grant_types: client.grant_types, scope: client.scope, active: client.active };
        }
        catch (error) {
            await transaction.rollback();
            throw new Error('Error creating client: ' + error.message);
        }
    },

    get_all_clients: async () => {
        const clients = await Client.findAll();
        return clients;
    },

    get_one_client: async (client_id) => {
        const client = await Client.findByPk(client_id);
        if (!client) {
            throw new Error('Client not found');
        }
        return client;
    },

    update_client: async (client_id, updates) => {
        console.log('updates', updates);
        const client = await Client.findByPk(client_id);
        if (!client) {
            throw new Error('Client not found');
        }
        await client.update(updates);
        return client;
    },

    delete_client: async (client_id) => {
        const client = await Client.findByPk(client_id);
        if (!client) {
            throw new Error('Client not found');
        }
        await client.destroy();
    }
};
    
    