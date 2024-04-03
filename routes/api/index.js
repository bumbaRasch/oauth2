// routes/api/index.js
import express from 'express';

import api_client_router from '../../routes/api/client_router.js';
import api_oauth2_router from '../../routes/api/oauth2_router.js';
import api_company_router from '../../routes/api/company_router.js';

const router = express.Router();

router.use(api_client_router);
router.use(api_oauth2_router);
router.use(api_company_router);

export default router;