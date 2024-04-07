// models/Client.js
import { Model, DataTypes } from 'sequelize';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import sequelize from './sequelize.js'; // import your sequelize instance

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
        defaultValue: () => crypto.randomBytes(16).toString('hex')
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
            } 
            else {
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
            } 
            else {
                this.setDataValue('scope', val);
            }
        },
    },
    company_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    client_name: {
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
    last_active: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM,
        values: ['unconfirmed', 'confirmed', 'suspended', 'deleted'],
        defaultValue: 'unconfirmed'
    },
    }, {
        sequelize,
        modelName: 'Client',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        hooks: {
        beforeCreate: async (client) => {
            const salt = await bcrypt.genSalt(10);
            client.client_secret = await bcrypt.hash(client.client_secret, salt);
        },
        beforeUpdate: async (client) => {
            if (client.changed('client_secret')) {
                const salt = await bcrypt.genSalt(10);
                client.client_secret = await bcrypt.hash(client.client_secret, salt);
            }
        }
    }
    
});

export default Client;