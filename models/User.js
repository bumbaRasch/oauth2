// models/User.js
import { Model, DataTypes } from 'sequelize';
import sequelize  from './sequelize.js'; // import your sequelize instance
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

class User extends Model {
  // This method will be used to compare the hashed password in the database with a plain text password
  async valid_password(password) {
    return bcrypt.compare(password, this.password);
  }
}

User.init({
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  secret_key: {
    type: DataTypes.STRING,
    defaultValue: () => crypto.randomBytes(16).toString('hex') // Generate a random secret key
  },
  company_id: { 
    type: DataTypes.UUID,
    allowNull: true,
  },
  roles: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: ['user']
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
}, {
  sequelize,
  modelName: 'User',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.changed('password')) {
        try {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        } 
        catch (error) {
          console.error('Error hashing password', error);
          throw error;
        }
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        try {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        } 
        catch (error) {
          console.error('Error hashing password', error);
          throw error;
        }
      }
    }
  },
});


export default User;