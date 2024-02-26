// models/associations.js
import User from './User.js';
import Company from './Company.js';
import AccessToken from './AccessToken.js';
import Client from './Client.js';
import AuthorizationCode from './AuthorizationCode.js';
import ClientGrantType from './ClientGrantType.js';
import Group from './Group.js';
import UserGroup from './UserGroup.js';
import CompanyGroup from './CompanyGroup.js';
import CompanyFeature from './CompanyFeature.js';
import RefreshToken from './RefreshToken.js';

AccessToken.belongsTo(User, { foreignKey: 'user_id' });
AccessToken.belongsTo(Client, { foreignKey: 'client_id' });


Client.hasMany(RefreshToken, { foreignKey: 'client_id' });
RefreshToken.belongsTo(Client, { foreignKey: 'client_id' });

AuthorizationCode.belongsTo(User, { foreignKey: 'user_id' });
AuthorizationCode.belongsTo(Client, { foreignKey: 'client_id' });


Client.hasMany(AccessToken, { foreignKey: 'client_id' });
Client.hasMany(AuthorizationCode, { foreignKey: 'client_id' });
Client.belongsTo(Company, { foreignKey: 'company_id' });
Client.belongsTo(User, { foreignKey: 'user_id' });
Client.hasMany(ClientGrantType, { foreignKey: 'client_id' });

ClientGrantType.belongsTo(Client, { foreignKey: 'client_id' });


Group.belongsToMany(User, { through: UserGroup });
Group.belongsToMany(Company, { through: CompanyGroup, foreignKey: 'group_id' });


Company.belongsToMany(Group, { through: CompanyGroup, foreignKey: 'company_id' });
Company.hasMany(User, { foreignKey: 'company_id' });
Company.hasMany(Client, { foreignKey: 'company_id' });
Company.hasMany(CompanyFeature, { foreignKey: 'company_id' });


CompanyFeature.belongsTo(Company, { foreignKey: 'company_id' });
CompanyFeature.belongsTo(User, { foreignKey: 'enabled_by' });


RefreshToken.belongsTo(User, { foreignKey: 'user_id' });


User.hasMany(AccessToken, { foreignKey: 'user_id' });
User.hasMany(AuthorizationCode, { foreignKey: 'user_id' })
User.belongsTo(Company, { foreignKey: 'company_id' });;
User.belongsToMany(Group, { through: UserGroup });
User.hasMany(CompanyFeature, { foreignKey: 'enabled_by' });
User.hasMany(RefreshToken, { foreignKey: 'user_id' });

