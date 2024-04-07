// models/sequelize.js
import {Sequelize} from 'sequelize';


// Initialize Sequelize
const sequelize = new Sequelize('my_app', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb',
});

// Import models and associations
/*
Dieser Code macht zwei Dinge:

Modelle importieren: Im ersten Teil des Codes importiert er asynchron verschiedene Modelle aus den entsprechenden JavaScript-Dateien. 
Dies beinhaltet die Modelle User, Client, Company, AccessToken, AuthorizationCode, RefreshToken, GrantType und ClientGrantType. 
Diese Modelle definieren wahrscheinlich die Struktur Ihrer Datentabellen in der Datenbank.

Modelle synchronisieren: Im zweiten Teil des Codes synchronisiert er alle Modelle mit der Datenbank. Das bedeutet, dass er Tabellen 
in der Datenbank erstellt, die Ihren Modellen entsprechen, falls sie noch nicht existieren. Die Option { force: true } gibt an, dass 
wenn die Tabellen bereits existieren, sie gelöscht und neu erstellt werden sollen. Dies kann während der Entwicklung nützlich sein, 
wird aber normalerweise für die Produktionsumgebung nicht empfohlen, da dies zum Verlust aller Daten führen würde.
*/

// (async () => {
//   await import('./User.js');
//   await import('./Company.js');
//   await import('./Client.js');
//   await import('./AccessToken.js');
//   await import('./AuthorizationCode.js');
//   await import('./RefreshToken.js');
//   await import('./GrantType.js');
//   await import('./ClientGrantType.js');
//   await import('./Group.js');
//   await import('./UserGroup.js');
//   await import('./CompanyGroup.js');
//   await import('./CompanyFeature.js');
//   await import('./BlacklistToken.js');
//   await import('./associations.js');
//   
// })();


// // Sync all models
// sequelize.sync({ force: false })
//   .then(() => console.log('All models were synchronized successfully.'))
//   .catch(error => console.log('An error occurred:', error));

export default sequelize;