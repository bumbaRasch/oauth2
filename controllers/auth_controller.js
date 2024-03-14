// controllers/auth_controller.js
// Implementierung des Controllers für die Authentifizierung.
import { auth_service } from '../services/auth_service.js';

export const auth_controller = {
    authorize: async (req, res) => {
        const { client_id, redirect_uri, response_type, scope, state, code_challenge, code_challenge_method } = req.query;
       
        try {
            const code = await auth_service.authorize(client_id, redirect_uri, response_type, scope, state, code_challenge, code_challenge_method, res.locals.user);
            res.redirect(`${redirect_uri}?code=${code.authorization_code}&state=${state}`);
        } 
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    },

    authenticate_and_set_user: async (req, res, next) => {
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const { user, decoded } = await auth_service.introspect_token(token);
            console.log('User', user);
    
            req.user = user;
            req.decoded = decoded;
            next();
        } 
        catch (error) {
            next(error);
        }
    },
    
    introspect_token: (req, res) => {
        res.status(200).json({ active: true });
    },
    
    introspect_token_info: async (req, res) => {
        try {
            res.render('introspect', {
                active: true,
                issued_at: req.decoded.payload.iat,
                expires_at: new Date(req.decoded.payload.exp * 1000),
                user_id: req.user.user_id,
            });
        } 
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    },
}