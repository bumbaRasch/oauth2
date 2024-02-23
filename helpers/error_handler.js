// helpers/error_handler.js
// Implementierung des Fehlerbehandlungsmoduls für Express-Anwendungen.
// error_handler.js
import { error_controller } from '../controllers/error_controller.js';
export const error_handler = (app) => {
  app.use((req, res, next) => {
    error_controller(req, res);
  });
};
