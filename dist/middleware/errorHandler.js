"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
function errorHandler(error, req, res, next) {
    let statusCode = 500;
    if (!error) {
        return res.status(statusCode).json({ error: "Internal server error" });
    }
    if (typeof error === "string") {
        return res.status(statusCode).json({ error });
    }
    statusCode = error.status || statusCode;
    res
        .status(statusCode)
        .json({ error: error.message || "Something went wrong" });
}
exports.errorHandler = errorHandler;
