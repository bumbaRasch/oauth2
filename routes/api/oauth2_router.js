// routes/api/aouth2.js
import express from 'express';
import { token_controller } from '../../controllers/api/token_controller.js';
import validators from '../../utils/validators.js';
import { client_controller } from '../../controllers/api/client_controller.js';

const router = express.Router();

router.get('/oauth2/verify_token', token_controller.verify_token_without_next);
router.post('/oauth2/get_token', token_controller.get_token)
router.post('/oauth2/companies/token', validators.validate_company_token_request, token_controller.get_token)
router.post('/oauth2/clients/token', validators.validate_client_token_request, token_controller.get_token)
export default router;