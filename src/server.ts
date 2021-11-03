import cors from "cors";
import express from "express";
import { PORT } from "./config";
import router from "./routes";
import "./core/admin";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

if (process.env.NODE_ENV !== "production") {
  require("./dev").use(app);
}

app.use(cors());
app.use(express.json());

app.use(router);

app.use(errorHandler);

app.listen(PORT, () =>
  console.log("app is running on http://localhost:%d", PORT)
);
