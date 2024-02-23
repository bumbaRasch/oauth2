import express from 'express';
import company_controller from '../controllers/company/company_controller.js';
import { company_middlewares } from '../middlewares/company_middleware.js';
import { validation_middleware } from '../middlewares/validation_middleware.js';
import { auth_middleware } from '../middlewares/auth_middleware.js';

const router = express.Router();

router.post('/companies', validation_middleware.validate_registration_input, company_controller.create);
router.get('/companies/:uuid', auth_middleware.authenticate_user, auth_middleware.authorize_company, company_middlewares.company_exists,  company_controller.get_company);
router.put('/companies/:uuid', company_middlewares.company_exists,  company_controller.update); //  auth_middleware.authenticate_user,
router.delete('/companies/:uuid', company_controller.delete);

export default router;