import {Sequelize} from 'sequelize';
import path from 'path';

// Connect to the database
const database = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
});

async function syncDatabase() {
  // Sequelize will create the database and tables if they don't exist.
  // And automatically locate all our schemas in the 'models' folder
  // Sync all models that aren't already in the database
  await database.sync().then(() => {
    console.log(`[DATABASE]: Database & tables created!`);
  });
}

export default database;
export {syncDatabase};
