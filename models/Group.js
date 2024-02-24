// models/Group.js
import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

class Group extends Model {}

Group.init({
  group_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  }
}, {
  sequelize,
  modelName: 'Group',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Group;