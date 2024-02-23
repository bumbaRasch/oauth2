// oidc_config.js
import Provider from 'oidc-provider';
import Sequelize_Adapter from '../models/Sequelize_adapter.js';
import sequelize from '../models/sequelize.js';
import dotenv from 'dotenv';
dotenv.config();

// Konfiguration für das OpenID Connect-Modul.
export const oidc_config = {
    adapter: (name) => new Sequelize_Adapter(name, sequelize),
    clients: [{
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_types: ['authorization_code'],
        redirect_uris: [process.env.REDIRECT_URI],
    }],
    find_account,
    cookies: {
        keys: [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2],
    },
    features: {
        devInteractions: { enabled: false },
        introspection: { enabled: true },
        revocation: { enabled: true },
    },
    formats: {
        AccessToken: 'jwt',
    },
    subjectTypes: ['public'],
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


// 
async function find_account(ctx, id) {
    return {
      accountId: id,
      async claims(use, scope) { return { sub: id }; }
    }
}
