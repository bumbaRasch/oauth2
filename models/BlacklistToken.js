// models/BlacklistToken.js
import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize.js'; // import your sequelize instance

class BlacklistToken extends Model {}
BlacklistToken.init({
    blacklist_token_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  token: DataTypes.STRING(255),
}, { sequelize, modelName: 'Blacklist' });

export default BlacklistToken;