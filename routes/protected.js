// routes/protected.js
import express from 'express';
import authenticate from '../middleware/jwt_authenticate.js';

const router = express.Router();

router.get('/protected', authenticate, (req, res) => {
  res.send({ message: `Hello user ${req.userId}` });
});

export default router;