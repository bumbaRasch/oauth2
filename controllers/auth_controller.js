// controllers/auth_controller.js
// Implementierung des Controllers für die Authentifizierung.
import User  from '../models/User.js';
import { generate_random_string } from '../utils/generate.js';
import { randomBytes } from 'crypto';
import { createHash } from 'crypto';

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
      const { username, password, company_id } = req.body;
      const user = await User.authenticate(username, password, company_id);

      if (user) {
        req.session.user = user;
        req.session.company_id = company_id;  // Set the company_id in the session
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
    const code_verifier = generate_random_string(64);
    const code_challenge = createHash('sha256').update(code_verifier).digest('base64');
    req.session.code_verifier = code_verifier;
    const authorization_code = generate_random_string(16);
    req.session.authorization_code = authorization_code;
    const redirect_uri = req.query.redirect_uri;
    res.redirect(`${redirect_uri}?code=${authorization_code}&code_challenge=${code_challenge}&code_challenge_method=S256`);
  }
};