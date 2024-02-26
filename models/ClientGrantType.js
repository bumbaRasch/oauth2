//models/ClientGrantType.js
import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize.js'; // import your sequelize instance

class ClientGrantType extends Model {}
ClientGrantType.init({
  client_grant_type_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
}, { sequelize, modelName: 'ClientGrantType' });

(async () => {
    const Client = (await import('./Client.js')).default;
    const GrantType = (await import('./GrantType.js')).default;
  
    Client.hasMany(ClientGrantType, { foreignKey: 'client_id' });
    ClientGrantType.belongsTo(Client, { foreignKey: 'client_id' });
  
    GrantType.hasMany(ClientGrantType, { foreignKey: 'grant_type_id' });
    ClientGrantType.belongsTo(GrantType, { foreignKey: 'grant_type_id' });
  })();
  
export default ClientGrantType;