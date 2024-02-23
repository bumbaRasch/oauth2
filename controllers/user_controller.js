//user_controller.js
import nodemailer from 'nodemailer';
import User from '../models/User.js';
// import { send_password_reset_email } from '../utils/email.js'; +
import sequelize from '../models/sequelize.js';
import { request_password_reset, reset_password } from '../services/user_service.js';
import { user_service } from '../services/user_service.js';

export const user_controller = {
  register: async (req, res) => {
      try {
        const user = await user_service.register(req.body);
        res.status(201).json({ message: 'User registered successfully',});
      } 
      catch (error) {
        res.status(400).send({ error: 'Error registering user' });
        console.log(error);
      }
  },

  login: async (req, res) => {
    try {
      const { user, token } = await user_service.login(req.body);
      console.log
      res.send({ message: 'User logged in successfully', user, token });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },

  verify_Mfa: async (req, res) => {
    try {
      const message = await user_service.verifyMfa(req.body);
      res.send({ message });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },

  update_secret_key: async (req, res) => {
    try {
      const user = await user_service.update_secret_key(req.params.userId);
      res.send({ message: 'Secret key updated successfully', user });
    } catch (error) {
      res.status(400).send({ error: error.message });
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
