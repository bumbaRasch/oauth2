// models/AccessToken.js
import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize.js'; // import your sequelize instance
import User from './User.js'; // import your User model
import Client from './Client.js'; // import your Client model

class AccessToken extends Model {}
AccessToken.init({
  access_token_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  access_token: DataTypes.STRING(255),
  expires: DataTypes.DATE,
}, { sequelize, modelName: 'AccessToken' });

User.hasMany(AccessToken, { foreignKey: 'user_id' });
AccessToken.belongsTo(User, { foreignKey: 'user_id' });

Client.hasMany(AccessToken, { foreignKey: 'client_id' });
AccessToken.belongsTo(Client, { foreignKey: 'client_id' });

export default AccessToken;