import app from "./app";
import config from "../config/env.config";
import { connect_db } from "../utils/database";

const port = config.port;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connect_db();
});
