//user_controller.js
import nodemailer from 'nodemailer';
import User from '../models/User.js';
// import { send_password_reset_email } from '../utils/email.js'; +
import sequelize from '../models/sequelize.js';
import { request_password_reset, reset_password } from '../services/user_service.js';
import { user_service } from '../services/user_service.js';
import { company_service } from '../services/company_service.js';

export const user_controller = {
  get_user_register: async (req, res, next) => {
      try {
          const companies = await company_service.get_companies();
          res.render('register_user', { companies });
      } 
      catch (error) {
          res.status(500).json({ error: error.message });
      }
  },

  register: async (req, res) => {
    try {
      const user = await user_service.register(req.body);
      const redirect_url = req.query.redirect ? decodeURIComponent(req.query.redirect) : '/oidc/login';
      req.session.registrationSuccess = true;
      res.redirect(redirect_url);
    } 
    catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  get_user_login: async (req, res) => {
    res.render('user_login');
  },

  login: async (req, res) => {
    try {
      const { user } = await user_service.login(req.body);
      req.session.user_id = user.user_id;
      req.session.user = user;
      res.redirect('/oidc/consent');
    } 
    catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  consent: async (req, res) => {
    try {
      // Display the consent page to the user
      res.render('consent');
    } 
    catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  verifyMfa: async (req, res) => {
    try {
      const result = await user_service.verifyMfa(req.body);
      res.status(200).json({ message: result });
    } 
    catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  update_secret_key: async (req, res) => {
    try {
      const user = await user_service.update_secret_key(req.params.userId);
      res.status(200).json(user);
    } 
    catch (error) {
      res.status(400).json({ error: error.message });
    }
  },



  logout: async (req, res) => {
      req.session.destroy(err => {
        if (err) {
          return res.redirect('/');  // Redirect to home page on error
        }
    
        res.clearCookie('sid');  // Clear the session cookie
        res.redirect('/');  // Redirect to home page
      });
  },

  request_password_reset: async (req, res) => {
    const { email } = req.body;
  
    try {
      await request_password_reset(email);
      res.send({ message: 'Password reset email sent' });
    } 
    catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  
  reset_password: async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    // Validate the new password
    if (password.length < 8) {
      return res.status(400).send({ error: 'Password must be at least 8 characters' });
    }
  
    try {
      await reset_password(token, password);
      res.send({ message: 'Password reset successfully' });
    } 
    catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};
