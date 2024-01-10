"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// db-handler.ts
const promise_1 = __importDefault(require("mysql2/promise"));
class DbHandler {
    constructor(dbConfig) {
        this.dbConfig = dbConfig;
        this.connection = promise_1.default.createPool(dbConfig);
    }
    executeQuery(query, values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield this.connection.execute(query, values);
                return rows;
            }
            catch (error) {
                console.error('Database error:', error);
                throw error;
            }
        });
    }
    insertBooking(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            const transformedString = bookingData.services.map(str => `'${str}'`).join(', ');
            const query = `INSERT INTO Bookings 
                   (services, startTime, endTime, totalAmount, name, email, phone, address )
                   VALUES ('${bookingData.services}', '${new Date(bookingData.startTime).toISOString().slice(0, 19).replace('T', ' ')}' 
                   , '${new Date(bookingData.endTime).toISOString().slice(0, 19).replace('T', ' ')}' , ${bookingData.totalAmount}, '${bookingData.name}'
                        , '${bookingData.email}', '${bookingData.phone}', '${bookingData.address}')`;
            yield this.executeQuery(query);
        });
    }
    deleteHour(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE 
                     FROM Hours 
                     WHERE startTime = '${data.startTime}'
                     AND endTime = '${data.endTime}'`;
            yield this.executeQuery(query);
        });
    }
    getHours() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        SELECT *
        FROM Hours;`;
            const hours = yield this.executeQuery(query);
            const formattedHours = hours.map(row => ({
                startTime: new Date(row.startTime).toISOString().slice(0, 19).replace('T', ' '),
                endTime: new Date(row.endTime).toISOString().slice(0, 19).replace('T', ' ')
            }));
            return formattedHours;
        });
    }
    getServices() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        SELECT *
        FROM Service;`;
            const services = yield this.executeQuery(query);
            return services;
        });
    }
    closeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.end();
        });
    }
}
exports.default = DbHandler;
