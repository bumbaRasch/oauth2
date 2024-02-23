// models/Sequelize_adapter.js
class Sequelize_Adapter {
    constructor(name, sequelize) {
        this.model = sequelize.models[name];
      }
    
      async upsert(id, payload, expires_in) {
        let expiresAt;
    
        if (expires_in) {
          expiresAt = new Date(Date.now() + expires_in * 1000);
        }
    
        await this.model.upsert({ id, payload, expiresAt });
        return payload;
      }
    
      async find(id) {
        const found = await this.model.findByPk(id);
        if (!found) return undefined;
        return found.payload;
      }
    
    // Implement the rest of the methods...
}
    
export default Sequelize_Adapter;