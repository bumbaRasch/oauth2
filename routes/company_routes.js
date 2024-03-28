// routes/company_routes.js
import express from 'express';
import company_controller from '../controllers/company/company_controller.js';
import { company_middlewares } from '../middlewares/company_middleware.js';
import { validation_middleware } from '../middlewares/validation_middleware.js';
import { auth_middleware } from '../middlewares/auth_middleware.js';
import { user_middleware } from '../middlewares/user_middleware.js';
import { token_controller } from '../controllers/token/token_controller.js';


const router = express.Router();

router.get('/register/company', company_controller.register_company);

router.post('/register/company', validation_middleware.validate_registration_input, company_controller.create);

// Temporare token for create a company
router.post('/get_temp_token', token_controller.get_temp_token);


router.get('/companies', token_controller.verify_token, auth_middleware.authenticate_user_with_token, company_controller.get_companies);
router.get('/companies/:uuid', auth_middleware.authenticate_user_with_token, auth_middleware.authenticate_company, auth_middleware.authorize_company, company_middlewares.company_exists,  company_controller.get_company);
router.put('/companies/:uuid', auth_middleware.authenticate_user_with_token, auth_middleware.authorize_roles(['admin']), auth_middleware.authorize_permissions(['update_company']), auth_middleware.authenticate_company, auth_middleware.authorize_company, company_middlewares.company_exists,  company_controller.update);
router.delete('/companies/:uuid', auth_middleware.authenticate_user_with_token, auth_middleware.authorize_roles(["admin"]), auth_middleware.authenticate_company, auth_middleware.authorize_company, company_middlewares.company_exists, company_controller.delete);

router.get('/companies/:uuid/users', auth_middleware.authenticate_user_with_token, auth_middleware.authenticate_company, auth_middleware.authorize_company, company_controller.get_company_users);
router.get('/companies/:uuid/users/search', auth_middleware.authenticate_user_with_token, auth_middleware.authenticate_company, auth_middleware.authorize_company, company_controller.search_company_users);
router.get('/companies/:uuid/users/filter', auth_middleware.authenticate_user_with_token, auth_middleware.authenticate_company, auth_middleware.authorize_company, company_controller.filter_company_users);

// Statistics routes for companies
// router.get('/companies/:uuid/stats', auth_middleware.authenticate_user, auth_middleware.authorize_roles(['admin']), auth_middleware.authenticate_company, auth_middleware.authorize_company, company_controller.get_company_stats);


// Create a new company user
router.post('/companies/:uuid/users', auth_middleware.authenticate_user_with_token, auth_middleware.authorize_roles(['admin']), company_controller.add_user_to_company);

// Update a company user
router.put('/companies/:uuid/users/:user_uuid', auth_middleware.authenticate_user_with_token, auth_middleware.authorize_roles(['admin']), user_middleware.check_user_exists, company_controller.update_user_in_company);

// Remove a user from a company
router.delete('/companies/:uuid/users/:user_uuid', auth_middleware.authenticate_user_with_token, auth_middleware.authorize_roles(['admin']), user_middleware.check_user_exists, company_controller.remove_user_from_company);
export default router;