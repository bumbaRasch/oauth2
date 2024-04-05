// controllers/api/token_controller.js
import { token_service } from '../../services/token/token_service.js';


export const token_controller = {
    // Temporare token for create a company
    get_token: async (req, res) => {

        const token = await token_service.generate_token(req.body);
        
        res.status(200).json({ token: token });
    },

    verify_token_with_next: (key) => {
        return async (req, res, next) => {
            try {
                const token = token_service.find_token(req.headers, req.cookies, req.body, req.query);
            
                const is_blacklisted = await token_service.blacklist_verify_token(token);
                
                if (is_blacklisted) {
                    return res.status(401).json({ message: 'Token is blacklisted' });
                }
                
                const is_valid = await token_service.verify_token(token);
            
                if (!is_valid) {
                    return res.status(401).json({ message: 'Token is invalid or expired' });
                }
                
                if(key){
                    token_service.compare_token_and_query_data(token, req.query, key);
                }
                    
                next();
            } 
            catch (error) {
                return res.status(401).json({ message: error.message });
            }   
        }
    },
    
    verify_token_without_next: async (req, res) => {
        try {
            const token = token_service.find_token(req.headers, req.cookies, req.body, req.query);
        
            const is_blacklisted = await token_service.blacklist_verify_token(token);
            
            if (is_blacklisted) {
                return res.status(401).json({ message: 'Token is blacklisted' });
            }
            
            const is_valid = await token_service.verify_token(token);
        
            if (!is_valid) {
                return res.status(401).json({ message: 'Token is invalid or expired' });
            }
            
            return res.status(200).json({ is_valid: is_valid });
        }
        catch (error) {
            return res.status(401).json({ message: error.message });
        }
       
    },










    // Basic authentication
    check_token: async (req, res) => {
        try {
            const result = await token_service.check_token(req.headers.authorization, req.body.token);
            res.status(200).json(result);
        } 
        catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    },

    // Bearer authentication code exchange to token
    exchange_code_for_token: async (req, res) => {
        const { code, redirect_uri, grant_type } = req.body;
        const auth_header = req.headers.authorization;
        const auth_parts = auth_header.split(' ');

        const [client_id, client_secret] = Buffer.from(auth_parts[1], 'base64').toString().split(':');

        try {
            const { token, refresh_token } = await token_service.exchange_code_for_token(code, client_id, client_secret, redirect_uri);        
            res.status(200).json({ access_token: token, refresh_token: refresh_token });
        } 
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    refresh_token: async (req, res) => {
        const auth_header = req.headers.authorization;
        if (!auth_header) {
            return res.status(401).json({ error: 'Authorization header is required' });
        }
    
        const auth_parts = auth_header.split(' ');
        if (auth_parts.length !== 2 || auth_parts[0] !== 'Bearer') {
            return res.status(401).json({ error: 'Invalid authorization header format. Format is "Bearer refreshToken"' });
        }
    
        const refresh_token = auth_parts[1];
    
        try {
            const newTokens = await token_service.refresh_token(refresh_token);
            res.json(newTokens);
        } 
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    revoke_token: async (req, res) => {
        try {
            const auth_header = req.header('Authorization');
            if (!auth_header) {
                return res.status(401).json({ error: 'Authorization header is required' });
            }

            const token = auth_header.replace('Bearer ', '');        
            await token_service.revoke_token(token);
            res.status(200).json({ message: 'Token revoked successfully' });
        } 
        catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    },
};