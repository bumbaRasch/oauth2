//models/AuthorizationCode.js
import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize.js'; // import your sequelize instance
import User from './User.js'; // import your User model
import Client from './Client.js'; // import your Client model

class AuthorizationCode extends Model {}
AuthorizationCode.init({
  authorization_code_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  authorization_code: DataTypes.STRING(255),
  redirect_uri: DataTypes.STRING(255),
  expires: DataTypes.DATE,
  used: DataTypes.BOOLEAN,
}, { sequelize, modelName: 'AuthorizationCode' });

export default AuthorizationCode;