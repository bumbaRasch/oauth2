// routes/index.js
// Zusammenführung verschiedener Routen, einschließlich der Authentifizierungsrouten.
import express from 'express';
const router = express.Router();

import user_routes from './user_routes.js';
import error_routes from './error_routes.js';
import client_routes from './client_routes.js';
import company_router from './views/company_router.js';
import auth_routes from './auth_routes.js';
import home_router from './home_router.js';

router.use('/protected', error_routes);
router.use('/views/', client_routes);
router.use('/views/', user_routes);
router.use('/views/', company_router);
router.use(auth_routes); 
router.use(home_router);

export default router;