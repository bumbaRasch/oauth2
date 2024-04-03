// routes/api/aouth2.js
import express from 'express';
import { token_controller } from '../../controllers/api/token_controller.js';

const router = express.Router();

router.get('/oauth2/verify_token', token_controller.verify_token_without_next);
router.post('/oauth2/get_temp_token', token_controller.get_temp_token)

export default router;