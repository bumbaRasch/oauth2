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
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deleted_by: {
    type: DataTypes.UUID,
    allowNull: true,
  }
}, {
    sequelize,
    modelName: 'UserGroup',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // This enables soft deletion
});

export default UserGroup;