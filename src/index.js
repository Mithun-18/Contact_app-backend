import { app } from "./app.js";
import { checkConnection } from "./db/index.js";

const port = process.env.PORT || 8080;

checkConnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`server is running on http://localhost:${port}/`);
    });
  })
  .catch((_) => {
    process.exit(1);
  });
