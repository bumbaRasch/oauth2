// controllers/auth_controller.js
// Implementierung des Controllers für die Authentifizierung.
import { auth_service } from '../services/auth_service.js';

export const auth_controller = {
    authorize: async (req, res) => {
        const { client_id, redirect_uri, response_type, scope, state } = req.query;
       
        try {
            const code = await auth_service.authorize(client_id, redirect_uri, response_type, scope, state, req.user);
            res.redirect(`${redirect_uri}?code=${code.authorization_code}&state=${state}`);
        } 
        catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}