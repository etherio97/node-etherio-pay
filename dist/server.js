"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const routes_1 = __importDefault(require("./routes"));
require("./core/admin");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(`${__dirname}/../public`));
app.use(routes_1.default);
app.listen(config_1.PORT, () => console.log("app is running on http://localhost:%d", config_1.PORT));
