// services/auth_service.js
import Client from '../models/Client.js';
import AuthorizationCode from '../models/AuthorizationCode.js';

export const auth_service = {
    authorize: async (client_id, redirect_uri, response_type, scope, state, user) => {
        if (!client_id) {
            throw new Error('client_id is required');
        }

        if (!redirect_uri) {
            throw new Error('redirect_uri is required');
        }

        if (!response_type) {
            throw new Error('response_type is required');
        } 
        else if (response_type !== 'code') {
            throw new Error('Invalid response_type. Only "code" is supported');
        }

        if (!scope) {
            throw new Error('scope is required');
        }

        if (!state) {
            throw new Error('state is required');
        }

        const client = await Client.findByPk(client_id);

        if (!client) {
            throw new Error('Invalid client_id');
        }

        if (!client.active) {
            throw new Error('Client is inactive');
        }

        if (client.redirect_uri !== redirect_uri) {
            throw new Error('Invalid redirect_uri');
        }

        const client_scopes = client.scope;
        const requested_scopes = scope.split(' ');

        if (!requested_scopes.every(requested_scope => client_scopes.includes(requested_scope))) {
            throw new Error('Invalid scope');
        }

        const code = await AuthorizationCode.create({
            client_id: client.client_id,
            user_id: user.user_id,
            scope: requested_scopes.join(' '),
            redirect_uri: redirect_uri,
            expires: new Date(Date.now() + 15 * 60 * 1000),
            used: false,
        });

        console.log('code', code);

        return code;
    }
}