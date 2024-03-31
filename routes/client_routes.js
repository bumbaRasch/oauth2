// routes/client_routes.js
import express from 'express';
import { client_controller } from '../controllers/client_controller.js';
import { token_controller } from '../controllers/token/token_controller.js';
import { company_controller } from '../controllers/company/company_controller.js';
import crypto from 'crypto';
const router = express.Router();

router.get('/register/client', token_controller.verify_token,  company_controller.get_company_from_cookie, client_controller.register_client);
router.post('/register/client', token_controller.verify_token, client_controller.create_client);
router.get('/clients', client_controller.get_all_clients);
router.get('/clients/:client_id', client_controller.get_one_client);
router.put('/clients/:client_id', client_controller.update_client);
router.delete('/clients/:client_id', client_controller.delete_client);

// // Generate a random client secret
// router.post('/generate_secret', (req, res) => {
//     const client_secret = crypto.randomBytes(20).toString('hex');
//     res.json({ client_secret });
// });

export default router;