import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize.js'; // import your sequelize instance
import User from './User.js'; // import your User model
import Client from './Client.js'; // import your Client model

class RefreshToken extends Model {}
RefreshToken.init({
  refresh_token_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  refresh_token: DataTypes.TEXT,
  expires: DataTypes.DATE,
}, { sequelize, modelName: 'RefreshToken' });

User.hasMany(RefreshToken, { foreignKey: 'user_id' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

Client.hasMany(RefreshToken, { foreignKey: 'client_id' });
RefreshToken.belongsTo(Client, { foreignKey: 'client_id' });

export default RefreshToken;