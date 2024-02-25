// routes/company_routes.js
import express from 'express';
import company_controller from '../controllers/company/company_controller.js';
import { company_middlewares } from '../middlewares/company_middleware.js';
import { validation_middleware } from '../middlewares/validation_middleware.js';
import { auth_middleware } from '../middlewares/auth_middleware.js';

const router = express.Router();

router.post('/companies', validation_middleware.validate_registration_input, company_controller.create);
router.get('/companies', auth_middleware.authenticate_user, auth_middleware.authorize_roles(['admin']), company_controller.get_companies);
router.get('/companies/:uuid', auth_middleware.authenticate_user, auth_middleware.authenticate_company, auth_middleware.authorize_company, company_middlewares.company_exists,  company_controller.get_company);
router.put('/companies/:uuid', auth_middleware.authenticate_user, auth_middleware.authorize_roles(['admin']), auth_middleware.authorize_permissions(['update_company']), auth_middleware.authenticate_company, auth_middleware.authorize_company, company_middlewares.company_exists,  company_controller.update);
router.delete('/companies/:uuid', auth_middleware.authenticate_user, auth_middleware.authorize_roles(["admin"]), auth_middleware.authenticate_company, auth_middleware.authorize_company, company_middlewares.company_exists, company_controller.delete);

router.get('/companies/:uuid/users', auth_middleware.authenticate_user, auth_middleware.authenticate_company, auth_middleware.authorize_company, company_controller.get_company_users);
router.get('/companies/:uuid/users/search', auth_middleware.authenticate_user, auth_middleware.authenticate_company, auth_middleware.authorize_company, company_controller.search_company_users);
router.get('/companies/:uuid/users/filter', auth_middleware.authenticate_user, auth_middleware.authenticate_company, auth_middleware.authorize_company, company_controller.filter_company_users);
export default router;