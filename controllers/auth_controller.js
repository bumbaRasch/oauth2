// controllers/auth_controller.js
// Implementierung des Controllers für die Authentifizierung.
import crypto from 'crypto';
import User  from '../models/User.js';
import dotenv from 'dotenv';
// import { send_password_reset_email } from '../utils/email.js';  // You'll need to implement this


export const auth_controller = async (req, res) => {
    const { oidc } = req;

    const { prompt: { name, details }, uid, result } = oidc;
   
    switch (name) {
      case 'login': {
        // If it's a GET request, render the login form
        if (req.method === 'GET') {
          return res.render('login', { details, uid });
        }
  
        // If it's a POST request, handle the form submission
        if (req.method === 'POST') {
          const { username, password, companyId } = req.body;
        
          // Authenticate the user within the context of their company
          const user = await User.authenticate(username, password, companyId);
  
          if (user) {
            // If the user is authenticated, store them in the session and proceed to the 'consent' prompt
            req.session.user = user;
            oidc.promptResult = 'login';
            return oidc.interactionFinished(req, res, { mergeWithLastSubmission: false });
          } 
          else {
            // If the user is not authenticated, render the login form with an error message
            return res.render('login', { details, uid, error: 'Invalid username or password' });
          }
        }
  
        break;
      }
      case 'consent': {
        // If it's a GET request, render the consent form
        if (req.method === 'GET') {
          return res.render('consent', { details, uid, client: result.client });
        }
  
        // If it's a POST request, handle the form submission
        if (req.method === 'POST') {
          // Here you would handle the user's consent, e.g. store it in the database
          // For simplicity, let's just proceed to the next prompt
          oidc.promptResult = 'consent';
          return oidc.interactionFinished(req, res, { mergeWithLastSubmission: false });
        }
  
        break;
      }
      default: {
        return oidc.interactionFinished(req, res, { mergeWithLastSubmission: false });
      }
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


