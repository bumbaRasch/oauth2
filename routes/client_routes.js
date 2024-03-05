// routes/client_routes.js
import express from 'express';
import {client_controller} from '../controllers/client_controller.js';
import { company_service } from '../services/company_service.js';
const router = express.Router();

router.get('/register/client', async function(req, res) {
    try {
        const companies = await company_service.get_companies();  // Get all companies
        const selected_company_id = req.query.company_id;  // Get the company_id from the query string
        res.render('register_client', { companies, selected_company_id });  // Pass the companies and the selectedCompanyId to the view
    } 
    catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/register/client', client_controller.create_client);
router.get('/clients', client_controller.get_all_clients);
router.get('/clients/:client_id', client_controller.get_one_client);
router.put('/clients/:client_id', client_controller.update_client);
router.delete('/clients/:client_id', client_controller.delete_client);

export default router;