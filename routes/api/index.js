// routes/api/index.js
import express from 'express';
import { client_controller } from '../../controllers/api/client_controller.js';
import api_client_router from '../../routes/api/client_router.js';

const router = express.Router();

router.use(api_client_router);

export default router;