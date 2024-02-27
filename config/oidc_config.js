// config/oidc_config.js
import Sequelize_Adapter from '../models/Sequelize_adapter.js';
import sequelize from '../models/sequelize.js';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Client from '../models/Client.js';
dotenv.config();

export async function create_oidc_configuration() {
    const clients_from_db = await Client.findAll();
    const clients = clients_from_db.map(client => ({
        client_id: client.client_id,
        client_secret: client.client_secret,
        grant_types: ['authorization_code'],
        redirect_uris: [client.redirect_uri],
    }));

    return {
        adapter: (name) => new Sequelize_Adapter(name, sequelize),
        clients: clients,
        find_account: async (ctx, user_id) => {
            const user = await User.findByPk(user_id);
            if (!user) throw new Error('User not found');
            return {
                account_id: user_id,
                async claims(use, scope) { return { sub: user_id }; },
            };
        },
        cookies: {
            keys: [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2],
        },
        features: {
            devInteractions: { enabled: false },
            introspection: { enabled: true },
            revocation: { enabled: true },
        },
        formats: {
            access_token: 'jwt',
        },
        subject_types: ['public'],
        interactionUrl(ctx, interaction) {
            return `/interaction/${ctx.oidc.uid}`;
        },
        claims: {
            address: ['address'],
            email: ['email', 'email_verified'],
            phone: ['phone_number', 'phone_number_verified'],
            profile: ['birthdate', 'family', 'name', 'gender', 'picture'],
        },
    };
}