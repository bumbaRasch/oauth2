// models/associations.js
import User from './User.js';
import Company from './Company.js';
import AccessToken from './AccessToken.js';
import Client from './Client.js';
import AuthorizationCode from './AuthorizationCode.js';
import ClientGrantType from './ClientGrantType.js';

// access_token belongs to user
User.hasMany(AccessToken, { foreignKey: 'user_id' });
AccessToken.belongsTo(User, { foreignKey: 'user_id' });

// access_token belongs to client
Client.hasMany(AccessToken, { foreignKey: 'client_id' });
AccessToken.belongsTo(Client, { foreignKey: 'client_id' });

// authorization_code belongs to user
User.hasMany(AuthorizationCode, { foreignKey: 'user_id' });
AuthorizationCode.belongsTo(User, { foreignKey: 'user_id' });

// authorization_code belongs to client
Client.hasMany(AuthorizationCode, { foreignKey: 'client_id' });
AuthorizationCode.belongsTo(Client, { foreignKey: 'client_id' });

// user belongs to company
User.belongsTo(Company, { foreignKey: 'company_id' });

// company has many users
Company.hasMany(User, { foreignKey: 'company_id' });

// user has many clients
User.hasMany(Client, { foreignKey: 'user_id' });
// client belongs to user
Client.belongsTo(User, { foreignKey: 'user_id' });

// client has many grant_types
Client.hasMany(ClientGrantType, { foreignKey: 'client_id' });

// grant_type belongs to client
ClientGrantType.belongsTo(Client, { foreignKey: 'client_id' });