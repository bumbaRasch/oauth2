// middleware/authenticate.js
// Middleware-Implementierung für die Überprüfung von JWT-Token.

import jwt from 'jsonwebtoken';


const authenticate = (req, res, next) => {
  const auth_header = req.headers.authorization;

  if (!auth_header) {
    return res.status(401).send({ error: 'No token provided' });
  }

  const parts = auth_header.split(' ');

  if (parts.length !== 2) {
    return res.status(401).send({ error: 'Token error' });
  }

  const [ scheme, token ] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Malformatted token' });
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Invalid token' });
    }

    req.userId = decoded.id;
    next();
  });
};

export default authenticate;