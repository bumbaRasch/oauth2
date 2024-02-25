// controllers/auth_controller.js
// Implementierung des Controllers für die Authentifizierung.
import crypto from 'crypto';
import User  from '../models/User.js';

// import { send_password_reset_email } from '../utils/email.js';  // You'll need to implement this


export const auth_controller = {
  process: async (req, res) => {
    const { oidc } = req;
    const { prompt: { name, details }, uid, result } = oidc;

    switch (name) {
      case 'login':
        return auth_controller.login(req, res, details, uid, oidc);
      case 'consent':
        return auth_controller.consent(req, res, details, uid, oidc, result);
      case 'authorize':
        return auth_controller.authorize(req, res);
      default:
        return oidc.interactionFinished(req, res, { mergeWithLastSubmission: false });
    }
  },

  login: async (req, res, details, uid, oidc) => {
    if (req.method === 'GET') {
      return res.render('login', { details, uid });
    }

    if (req.method === 'POST') {
      const { username, password, companyId } = req.body;
      const user = await User.authenticate(username, password, companyId);

      if (user) {
        req.session.user = user;
        req.session.company_id = companyId;  // Set the company_id in the session
        req.session.save();  // Save the session
        oidc.promptResult = 'login';
        return oidc.interactionFinished(req, res, { mergeWithLastSubmission: false });
      } else {
        return res.render('login', { details, uid, error: 'Invalid username or password' });
      }
    }
  },

  consent: async (req, res, details, uid, oidc, result) => {
    if (req.method === 'GET') {
      return res.render('consent', { details, uid, client: result.client });
    }

    if (req.method === 'POST') {
      oidc.promptResult = 'consent';
      return oidc.interactionFinished(req, res, { mergeWithLastSubmission: false });
    }
  },

  authorize: async (req, res) => {
    const authorization_code = crypto.randomBytes(20).toString('hex');
    req.session.authorization_code = authorization_code;
    const redirect_uri = req.query.redirect_uri;
    res.redirect(`${redirect_uri}?code=${authorization_code}`);
  }
};


export const request_password_reset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).send({ error: 'No user found with that email' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);  // Token expires in 1 hour

    user.password_reset_token = token;
    user.password_reset_expires = expires;

    await user.save();

    await send_password_reset_email(email, token);

    res.send({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(400).send({ error: 'Error resetting password' });
  }
};

export const reset_password = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ where: { password_reset_token: token } });

    if (!user || user.password_reset_expires < new Date()) {
      return res.status(400).send({ error: 'Invalid or expired password reset token' });
    }

    user.password = password;
    user.password_reset_token = null;
    user.password_reset_expires = null;

    await user.save();

    res.send({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(400).send({ error: 'Error resetting password' });
  }
};