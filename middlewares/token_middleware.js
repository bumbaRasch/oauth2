// middlewares/token_middleware.js
import jwt from 'jsonwebtoken';

export const token_middleware = {
    verify_refresh_token: async (req, res, next) => {
        const { refreshToken } = req.body;

        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            req.user_uuid = decoded.user_uuid;
            next();
        } catch (err) {
            return res.status(403).json({ error: 'Invalid or expired refresh token' });
        }
    },
};