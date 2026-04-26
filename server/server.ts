import express from "express";
import cors from "cors";

import { requestLoggerMiddleware } from "./middleware/index.js";
import routes from "./routes/index.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use(
  cors({
    origin: `*`,
  }),
);

app.use(requestLoggerMiddleware);

app.use("/", routes);

export default app;

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}
