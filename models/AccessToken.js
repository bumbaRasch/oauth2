// models/AccessToken.js
import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize.js'; // import your sequelize instance

class AccessToken extends Model {}
AccessToken.init({
  access_token_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  access_token: DataTypes.STRING(255),
  expires: DataTypes.DATE,
}, { sequelize, modelName: 'AccessToken' });

export default AccessToken;