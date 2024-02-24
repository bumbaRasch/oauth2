// models/CompanyFeature.js
import { Model, DataTypes } from 'sequelize';
import sequelize  from './sequelize.js'; // import your sequelize instance

class CompanyFeature extends Model {}

CompanyFeature.init({
  company_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  feature: {
    type: DataTypes.STRING,
    allowNull: false
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  enabled_by: {
    type: DataTypes.UUID,
    allowNull: true
  },
  enabled_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'CompanyFeature',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  primaryKey: ['company_id', 'feature']
});

export default CompanyFeature;