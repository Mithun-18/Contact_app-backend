import mysql from "mysql2/promise";
import { dbConfig } from "./config.js";

const connectionPool = mysql.createPool({
  ...dbConfig,
  connectionLimit: 10,
});

function checkConnection() {
  return new Promise((resolve, reject) => {
    connectionPool
      .getConnection()
      .then((connection) => {
        connection.release();
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export { connectionPool, checkConnection };
