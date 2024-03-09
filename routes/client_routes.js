// routes/client_routes.js
import express from 'express';
import {client_controller} from '../controllers/client_controller.js';
import { company_service } from '../services/company_service.js';
const router = express.Router();

router.get('/register/client', client_controller.register_client);
router.post('/register/client', client_controller.create_client);
router.get('/clients', client_controller.get_all_clients);
router.get('/clients/:client_id', client_controller.get_one_client);
router.put('/clients/:client_id', client_controller.update_client);
router.delete('/clients/:client_id', client_controller.delete_client);

export default router;