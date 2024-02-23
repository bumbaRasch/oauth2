//models/GrantType.js
import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize.js'; // import your sequelize instance

class GrantType extends Model {}
GrantType.init({
  grant_type_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  grant_type: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
}, { sequelize, modelName: 'GrantType' });

export default GrantType;