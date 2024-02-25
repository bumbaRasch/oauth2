// middleware/user_middleware.js
import User from '../models/User.js';

export const user_middleware = {
    check_user_exists: async (req, res, next) => {
        const { user_uuid } = req.params;
        const user = await User.findOne({ where: { user_id: user_uuid } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        next();
    },
};
