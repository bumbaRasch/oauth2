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
  }
}, {
  sequelize,
  modelName: 'CompanyGroup',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default CompanyGroup;