// controllers/interaction_controller.js
// Implementierung des Controllers für die Interaktion während des Autorisierungsvorgangs.
// interaction_controller.js
import Provider from 'oidc-provider';
//import { oaut_model } from ('../models/oauth_model');
import express from 'express';
const router = express.Router();
const provider = require('./path/to/your/oidcProvider'); // Подключение к вашему OIDC провайдеру

router.get('/:uid', async (req, res) => {
  const details = await provider.interactionDetails(req);
  const client = await provider.Client.find(details.params.client_id);

  if (details.interaction.error === 'login_required') {
    return res.render('login', { client, uid: req.params.uid });
  }
  return res.render('interaction', { client, uid: req.params.uid });
});