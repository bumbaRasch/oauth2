// models/UserGroup.js
import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize.js';
import User from './User.js';
import Group from './Group.js';

class UserGroup extends Model {}

UserGroup.init({
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  group_id: {
    type: DataTypes.UUID,
    references: {
      model: Group,
      key: 'group_id'
    }
  }
}, {
  sequelize,
  modelName: 'UserGroup',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default UserGroup;