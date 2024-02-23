// init_database.js
import sequelize from './sequelize.js'; // import your sequelize instance
import User from './models/User.js'; // import your models
import Client from './models/Client.js';
import AccessToken from './models/AccessToken.js';
import AuthorizationCode from './models/AuthorizationCode.js';
import RefreshToken from './models/RefreshToken.js';
import GrantType from './models/GrantType.js';
import ClientGrantType from './models/ClientGrantType.js';


sequelize.authenticate()
.then(() => console.log('Connection has been established successfully.'))
.catch(error => console.error('Unable to connect to the database:', error));

// Sync all models
sequelize.sync({ force: true })
  .then(() => console.log('All models were synchronized successfully.'))
  .catch(error => console.log('An error occurred:', error));

