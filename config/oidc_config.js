// config/oidc_config.js
import Provider from 'oidc-provider';
import Sequelize_Adapter from '../models/Sequelize_adapter.js';
import sequelize from '../models/sequelize.js';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Company from '../models/Company.js';
dotenv.config();

export async function create_oidc_configuration() {
    const companies = await Company.findAll();
    const clients = companies.map(company => ({
        client_id: company.company_id,
        client_secret: company.secret_key,
        grant_types: ['authorization_code'],
        redirect_uris: [process.env.REDIRECT_URI],
    }));

    return {
        adapter: (name) => new Sequelize_Adapter(name, sequelize),
        clients: clients,
        find_account: async (ctx, id) => {
            const user = await User.findByPk(id);
            if (!user) throw new Error('User not found');
            return {
                account_id: id,
                async claims(use, scope) { return { sub: id }; },
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
        interaction_url(ctx, interaction) {
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