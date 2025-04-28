import { app } from "./app.js";
import { checkConnection, sequelize } from "./db/index.js";
import { Contacts } from "./models/index.js";

const port = process.env.PORT || 8080;

checkConnection()
  .then(() => {
    sequelize.sync({ alter: true }).then(() => {
      app.listen(port, () => {
        console.log(`server is running on http://localhost:${port}/`);
      });
    });
  })
  .catch((_) => {
    console.log("Connection Lost...!");
    process.exit(1);
  });
