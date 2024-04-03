// routes/company_router.js
import express from 'express';

import { token_controller } from '../../controllers/token/token_controller.js';


const router = express.Router();

// Temporare token for create a company
router.post('/get_temp_token', token_controller.get_temp_token);

export default router;