// routes/index.js
// Zusammenführung verschiedener Routen, einschließlich der Authentifizierungsrouten.
import express from 'express';
const router = express.Router();

import user_routes from './user_routes.js';
import error_routes from './error_routes.js';
import client_routes from './client_routes.js';
import company_routes from './company_routes.js';

router.use(user_routes);
// router.use('/', error_routes);
router.use('/protected', error_routes);
router.use(client_routes);
router.use(company_routes);


export default router;