// models/Company.js
import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize.js'; // import your sequelize instance
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

class Company extends Model {
  // This method will be used to compare the hashed password in the database with a plain text password
  async valid_password(password) {
    return bcrypt.compare(password, this.password);
  }
}

Company.init({
  company_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  secret_key: {
    type: DataTypes.STRING,
    defaultValue: () => crypto.randomBytes(16).toString('hex') // Generate a random secret key
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deleted_by: {
    type: DataTypes.UUID,
    allowNull: true
  },
  last_active: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, { 
  sequelize, 
  modelName: 'Company',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  hooks: {
    // Hash the password before saving the company
    beforeCreate: async (company) => {
      if (company.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        company.password = await bcrypt.hash(company.password, salt);
      }
    },
    beforeUpdate: async (company) => {
      if (company.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        company.password = await bcrypt.hash(company.password, salt);
      }
    }
  }
});

export default Company;