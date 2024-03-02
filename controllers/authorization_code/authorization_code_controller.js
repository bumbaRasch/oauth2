// controllers/authorization_code/authorization_code_controller.js
import { authorization_code_service } from '../../services/authorization_code/authorization_code_service.js';
export const authorization_code_controller = {
    create_authorization_code: async (req, res) => {
        try {
            const { client_id, user_id } = req.body;
            const code = await authorization_code_service.create_authorization_code(client_id, user_id);
            res.status(201).json(code);
        } 
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error occurred while creating the authorization code.', error: error.message, stack: error.stack });
        }
    },

    get_one_authorization_code: async (req, res) => {
        try {
            const { code_id } = req.params;
            const code = await authorization_code_service.get_one_authorization_code(code_id);
            res.status(200).json(code);
        } catch (error) {
            res.status(500).json({ message: 'Error occurred while retrieving the authorization code.' });
        }
    },

    get_all_authorization_codes: async (req, res) => {
        try {
            const codes = await authorization_code_service.get_all_authorization_codes();
            res.status(200).json(codes);
        } 
        catch (error) {
            res.status(500).json({ message: 'Error occurred while retrieving authorization codes.' });
        }
    },

    update_authorization_code: async (req, res) => {
        try {
            const { code_id } = req.params;
            const updates = req.body;
            const code = await authorization_code_service.update_authorization_code(code_id, updates);
            res.status(200).json(code);
        } 
        catch (error) {
            console.error(error); // log the error
            res.status(500).json({ message: 'Error occurred while updating the authorization code.' });
        }
    },

    delete_authorization_code: async (req, res) => {
        try {
            const { code_id } = req.params;
            await authorization_code_service.delete_authorization_code(code_id);
            res.status(204).send();
        } 
        catch (error) {
            res.status(500).json({ message: 'Error occurred while deleting the authorization code.' });
        }
    },
}