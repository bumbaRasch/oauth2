// routes/api/client_router.js
import express from 'express';
import { client_controller } from '../../controllers/api/client_controller.js';
import { token_controller } from '../../controllers/token/token_controller.js';

const router = express.Router();

router.post('/register/client', token_controller.verify_token, client_controller.create_client);


export default router;