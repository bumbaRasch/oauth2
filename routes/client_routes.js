// routes/client_routes.js
import express from 'express';
import {client_controller} from '../controllers/client_controller.js';
import crypto from 'crypto';
const router = express.Router();

router.get('/register/client', client_controller.register_client);
router.post('/register/client', client_controller.create_client);
router.get('/clients', client_controller.get_all_clients);
router.get('/clients/:client_id', client_controller.get_one_client);
router.put('/clients/:client_id', client_controller.update_client);
router.delete('/clients/:client_id', client_controller.delete_client);

router.post('/generate_secret', (req, res) => {
    const client_secret = crypto.randomBytes(20).toString('hex');
    res.json({ client_secret });
});

export default router;