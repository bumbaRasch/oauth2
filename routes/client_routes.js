// routes/client_routes.js
import express from 'express';
import {client_controller} from '../controllers/client_controller.js';

const router = express.Router();

router.get('/client/:clientId', client_controller.get_client);
router.post('/register-client', client_controller.register_client);

export default router;