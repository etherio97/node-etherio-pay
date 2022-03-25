"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guard = void 0;
const firebase_admin_1 = require("firebase-admin");
async function guard(req, res, next) {
    let headers = req.headers;
    try {
        if ('authorization' in headers) {
            let token = headers.authorization.slice(7);
            req['auth'] = await (0, firebase_admin_1.auth)().verifyIdToken(token);
            req['uid'] = req['auth']['uid'];
            next();
        }
        else {
            next('unauthorized');
        }
    }
    catch (e) {
        next({ message: e.message });
    }
}
exports.guard = guard;
