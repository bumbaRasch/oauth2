// models/CompanyGroup.js
import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize.js';
import Company from './Company.js';
import Group from './Group.js';

class CompanyGroup extends Model {}

CompanyGroup.init({
  company_id: {
    type: DataTypes.UUID,
    references: {
      model: Company,
      key: 'company_id'
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
    modelName: 'CompanyGroup',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // This enables soft deletion
});

export default CompanyGroup;