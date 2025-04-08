import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DB_URI, {
  pool: {
    max: 10,
    acquire: 60000,
  },
});

function checkConnection() {
  return new Promise((resolve, reject) => {
    sequelize
      .authenticate()
      .then((_) => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export { sequelize, checkConnection };
