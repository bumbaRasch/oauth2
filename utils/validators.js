// utils/validation.js
import { validate as validateUUID } from 'uuid';

export const validators = {
    validate_company_token_request: (req, res, next) => {
        if (!req.body) {
            return res.status(400).json({ error: 'Payload is required' });
        }

        const { company_name, password, email } = req.body;

        if (!company_name || typeof company_name !== 'string') {
            return res.status(400).json({ error: 'Invalid company_name' });
        }
    
        if (!password || typeof password !== 'string') {
            return res.status(400).json({ error: 'Invalid password' });
        }
    
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ error: 'Invalid email' });
        }
        next();
    },

    validate_client_token_request: (req, res, next) => {
        if (!req.body) {
            return res.status(400).json({ error: 'Payload is required' });
        }

        const { client_name, website, redirect_uri,  company_id} = req.body;

        if (!client_name || typeof client_name !== 'string') {
            return res.status(400).json({ error: 'Invalid client_name' });
        }
    
        if (!website || typeof website !== 'string') {
            return res.status(400).json({ error: 'Invalid website' });
        }
    
        if (!redirect_uri || typeof redirect_uri !== 'string') {
            return res.status(400).json({ error: 'Invalid email' });
        }

        try {
            validators.validate_uuids(company_id);
        } 
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
        
        next();
    },

    validate_uuids: (...uuids) => {
        uuids.forEach(uuid => {
            if (!uuid) {
                throw new Error('UUID is required');
            }
            if (typeof uuid !== 'string') {
                throw new Error('UUID must be a string');
            }
            if (!validateUUID(uuid)) {
                throw new Error('Invalid UUID format');
            }
        });
    },
}

export default validators;