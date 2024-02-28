// services/authorization_code/authorization_code_service.js

import AuthorizationCode from '../../models/AuthorizationCode.js';
export const authorization_code_service = {
    create_authorization_code: async (client_id, user_id, scope) => {
        // create the authorization code
        const code = await AuthorizationCode.create({ client_id, user_id, scope });
        return code;
    },

    get_all_authorization_codes: async () => {
        const codes = await AuthorizationCode.findAll();
        return codes;
    },

    get_one_authorization_code: async (authorization_code_id) => {
        const code = await AuthorizationCode.findByPk(authorization_code_id);
        if (!code) {
            throw new Error('Authorization code not found');
        }
        return code;
    },

    update_authorization_code: async (authorization_code_id, updates) => {
        const code = await AuthorizationCode.findByPk(authorization_code_id);
        if (!code) {
            throw new Error('Authorization code not found');
        }
        await code.update(updates);
        return code;
    },

    delete_authorization_code: async (authorization_code_id) => {
        const code = await AuthorizationCode.findByPk(authorization_code_id);
        if (!code) {
            throw new Error('Authorization code not found');
        }
        await code.destroy();
    }
}
