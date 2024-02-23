//router/session_routes.js
import express from 'express';


const router = express.Router();

app.get('/set-data', (req, res) => {
    req.session.user = { name: 'John Doe', loggedIn: true };
    res.send('Session data set');
});

 app.get('/get-data', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome ${req.session.user.name}`);
  } 
  else {
    res.send('No session data');
  }
}); 