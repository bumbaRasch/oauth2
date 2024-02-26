// oidc-server.js
import express from 'express';
import bodyParser from 'body-parser';
import Provider from 'oidc-provider';
import session from 'express-session';
import router from './routes/index.js';  // Import your routes
import { create_oidc_configuration } from './config/oidc_config.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

(async () => {
  const oidc_config = await create_oidc_configuration();
  const oidc = new Provider('http://localhost:3000', oidc_config);

  app.use(session({
    secret: process.env.SESSION_SECRET, // This is used to sign the session ID cookie.
    resave: false,                      // This forces the session to be saved back to the session store, even if the session was never modified during the request.
    saveUninitialized: true,            // This forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
    cookie: { secure: false, httpOnly: true, maxAge: 60000 }  // Session will expire after 60000 milliseconds (1 minute)  // This marks the cookie to be used with HTTPS only. In development, you can set it to false.
  }));

  app.get('/', (req, res) => {
    res.send('Welcome to the root route!');
  });

  app.use('/', router);

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  app.use(function(req, res, next) {
    res.status(404).send('Sorry, we could not find that!');
  });

/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Das Middleware oidc.callback() wird verwendet, um OpenID Connect-Antworten zu verarbeiten. Es sollte nach Ihren
Routen und vor jeder Middleware zur Fehlerbehandlung platziert werden. Dies liegt daran, dass  es die OIDC-Antworten
verarbeiten muss, bevor Ihre Routen die Anfragen behandeln, und auftretende Fehler während  dieses Prozesses
sollten an Ihre Middleware zur Fehlerbehandlung weitergeleitet werden.
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
  app.use(oidc.callback());

  app.listen(3000, () => {
    console.log('Server and oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration');
  });
})();