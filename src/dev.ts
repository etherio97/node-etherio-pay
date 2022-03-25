import { Application } from "express";

export const use = (app: Application) => {
  console.log("> using development environment");
  const morgan = require("morgan");
  app.use(morgan("dev"));
};
