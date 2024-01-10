"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// Move dbConfig into this file or load it from a separate config file
const database_handler_1 = __importDefault(require("./handlers/database-handler"));
const dbConfig = {
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_USER_PASSWORD || '',
    database: process.env.DB_NAME || '',
};
exports.db = new database_handler_1.default(dbConfig);
