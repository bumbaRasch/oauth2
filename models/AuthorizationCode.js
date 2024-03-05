//models/AuthorizationCode.js
import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize.js'; // import your sequelize instance

class AuthorizationCode extends Model {}
AuthorizationCode.init({
  authorization_code_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  client_id: DataTypes.UUID,
  user_id: DataTypes.UUID, 
  authorization_code: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  redirect_uri: DataTypes.STRING(255),
  code_challenge: DataTypes.STRING,
  code_challenge_method: { 
    type: DataTypes.STRING, 
    validate: {
      isIn: [['plain', 'S256']] // Only allow "plain" or "S256"
    }
  },
  scope: DataTypes.STRING,
  expires: DataTypes.DATE,
  used: DataTypes.BOOLEAN,
}, { sequelize, modelName: 'AuthorizationCode' });

export default AuthorizationCode;
