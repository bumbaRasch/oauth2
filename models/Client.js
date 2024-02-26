// models/Client.js
import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize.js'; // import your sequelize instance
import User from './User.js'; // import your User model
import ClientGrantType from './ClientGrantType.js'; // import your User model

class Client extends Model {}

Client.init({
  client_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: DataTypes.UUIDV4
  },
  client_secret: {
    type: DataTypes.STRING,
    allowNull: false
  },
  redirect_uri: {
    type: DataTypes.STRING,
    allowNull: false
  },
  grant_types: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      const value = this.getDataValue('grant_types');
      return value.includes(',') ? value.split(',') : value;
    },
    set(val) {
      if (Array.isArray(val)) {
        this.setDataValue('grant_types', val.join(','));
      } else {
        this.setDataValue('grant_types', val);
      }
    },
  },
  scope: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      const value = this.getDataValue('scope');
      return value.includes(',') ? value.split(',') : value;
    },
    set(val) {
      if (Array.isArray(val)) {
        this.setDataValue('scope', val.join(','));
      } else {
        this.setDataValue('scope', val);
      }
    },
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  privacy_policy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  terms_of_service: {
    type: DataTypes.STRING,
    allowNull: true,
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
  modelName: 'Client',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Client;