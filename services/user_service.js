// service/user_service.js

import crypto from 'crypto';
import User from '../models/User.js'; // import your User model
import sequelize from '../models/sequelize.js';
import jwt from 'jsonwebtoken';

export const user_service = {
  register: async (body) => {
    const { username, password, email, company_id } = body;
    const existing_user = await User.findOne({ where: sequelize.or({ username: username }, { email: email } )});
    if(existing_user) {
      throw new Error('Username or email already in use');
    }
    const user = await User.create({ username, password, email, company_id });
    await user.save();
    return user;
  }, 

  login: async ( body ) => {
    const  { username, password, company_id } = body;
    const user = await User.findOne({ where: sequelize.or({ username: username }, { company_id: company_id } )});
    if (!user) {
      throw new Error('Invalid username, password, or company');
    }
    const is_valid = await user.valid_password(password);
    if (!is_valid) {
      throw new Error('Invalid username, password, or company');
    }
    const code = crypto.randomBytes(3).toString('hex');
    user.mfa_code = code;
    await user.save();
    const token = jwt.sign({ uuid: user.user_id, company_uuid: user.company_id }, user.secret_key, { expiresIn: '1h' });
    return { user, token };
  },

  verifyMfa: async (body) => {
    const { token, code } = body;
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.id) {
      throw new Error('Invalid token');
    }
    const user = await User.findOne({ where: { mfa_code: code } });
    if (!user) {
      throw new Error('Invalid token');
    }
    return new Promise((resolve, reject) => {
      jwt.verify(token, user.secret_key, (err, verified) => {
        if (err) {
          reject(new Error('Invalid token'));
        }
        resolve('Access granted');
      });
    });
  },

  update_secret_key: async (userId) => {
    // Generate a new secret key
    const new_secret_key = crypto.randomBytes(16).toString('hex');

    // Update the user's secret key
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.secret_key = new_secret_key;
    await user.save();

    return user;
  },

};

export async function request_password_reset(email) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('No user found with that email');
  }

  const token = crypto.randomBytes(20).toString('hex');
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);  // Token expires in 1 hour

  user.password_reset_token = token;
  user.password_reset_expires = expires;

  await user.save();

  await send_password_reset_email(email, token);
}

export async function reset_password(token, password) {
  const user = await User.findOne({ where: { password_reset_token: token } });

  if (!user) {
    throw new Error('Invalid password reset token');
  }

  if (user.password_reset_expires < new Date()) {
    throw new Error('Expired password reset token');
  }

  // Hash the new password
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

  user.password = hashedPassword;
  user.password_reset_token = null;
  user.password_reset_expires = null;

  await user.save();
}