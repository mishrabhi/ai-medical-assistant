import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});