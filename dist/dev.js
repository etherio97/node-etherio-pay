"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.use = void 0;
const use = (app) => {
    console.log("> using development environment");
    const morgan = require("morgan");
    app.use(morgan("dev"));
};
exports.use = use;
