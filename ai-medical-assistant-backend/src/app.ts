import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

import routes from "./routes";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

// 404
app.use(notFoundMiddleware);

// Global Error Handler
app.use(errorMiddleware);

export default app;