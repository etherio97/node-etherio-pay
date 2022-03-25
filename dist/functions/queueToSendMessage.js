"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_URL = "https://calm-depths-62261.herokuapp.com";
function queueToSendMessage(msisdn, body) {
    return axios_1.default.post(`${API_URL}/message`, { msisdn, body }).catch((err) => err);
}
exports.default = queueToSendMessage;
