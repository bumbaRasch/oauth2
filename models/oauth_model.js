// models/oauth_model.js
// Implementierung des Modells für die Interaktion mit der Datenbank im Zusammenhang mit OAuth.
import jwt from 'jsonwebtoken';

export const oauth_model = {
  generateToken: (user) => {
    return jwt.sign(user, "my secret key", {
      expiresIn: 86400
    });
  }
};

