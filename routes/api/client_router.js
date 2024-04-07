// routes/api/client_router.js
import express from 'express';
import { client_controller } from '../../controllers/api/client_controller.js';
import { token_controller } from '../../controllers/api/token_controller.js';

const router = express.Router();

router.get('/register/client', token_controller.get_token);

router.post('/register/client', token_controller.verify_token_with_next(), client_controller.create_client);
router.get('/clients', token_controller.verify_token_with_next('client_id'), client_controller.get_all_clients);
router.get('/clients/:client_id', token_controller.verify_token_with_next('client_id'), client_controller.get_one_client);
router.put('/clients/:client_id',token_controller.verify_token_with_next('client_id'), client_controller.update_client);
router.delete('/clients/:client_id', token_controller.verify_token_with_next('client_id'), client_controller.delete_client);



//////////APP ROUTES//////////
router.post('/app/register', token_controller.get_token);
router.post('/app/create_temp_client', token_controller.verify_token_with_next("company_id"), client_controller.create_temporary_client)
router.get('/app/clients', client_controller.get_all_clients);

export default router;