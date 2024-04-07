// routes/api/aouth2.js
import express from 'express';
import { token_controller } from '../../controllers/api/token_controller.js';
import validators from '../../utils/validators.js';

const router = express.Router();

router.get('/oauth2/verify_token', token_controller.verify_token_without_next);
router.post('/oauth2/get_token', token_controller.get_token)
router.post('/oauth2/companies/get_token', validators.validate_company_token_request, token_controller.get_token)
router.post('/oauth2/clients/get_token',  token_controller.get_token)
export default router;