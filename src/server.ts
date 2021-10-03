import cors from "cors";
import express from "express";
import { PORT } from "./config";
import router from "./routes";
import "./core/admin";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/../public`));

app.use(router);

app.listen(PORT, () =>
  console.log("app is running on http://localhost:%d", PORT)
);
