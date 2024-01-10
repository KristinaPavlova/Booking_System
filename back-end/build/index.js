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
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envPath = path_1.default.resolve(__dirname, '../.env');
dotenv_1.default.config({ path: envPath });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const globals_1 = require("./globals");
const incomming_1 = require("./packet-interfaces/incomming");
const email_handler_1 = require("./handlers/email-handler");
const cors = require('cors');
process.env.TZ = 'UTC';
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
app.use(cors());
const ajv = new ajv_1.default({ allErrors: true, useDefaults: true });
(0, ajv_formats_1.default)(ajv);
//validation for booking request packet
const validateBooking = ajv.compile(incomming_1.bookingSchema);
// Endpoint to book a specific hour
app.post('/bookings', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingData = req.body;
    // Validate the input against the schema
    const isValid = validateBooking(bookingData);
    console.log("Receive booking request: ", bookingData);
    if (!isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validateBooking.errors });
    }
    console.log("Receive booking request: ", bookingData);
    try {
        // Insert booking data into the database using the DbHandler
        yield globals_1.db.insertBooking(bookingData);
        const email = {
            Recipients: [
                {
                    Email: bookingData.email
                }
            ],
            Content: {
                Body: [
                    {
                        ContentType: "PlainText",
                        Content: `Здравейте, вашата резервация е обработена успешно. \n
                        Ще ви очакваме на ${bookingData.address} в ${bookingData.startTime}. \n\n
                        Поздрави, Екипът на Street Car Wash.`
                    }
                ],
                "From": "carwash.20222@gmail.com",
                "Subject": "Car Wash Reservation"
            }
        };
        (0, email_handler_1.sendEmail)(email);
        const reservedHout = {
            startTime: bookingData.startTime,
            endTime: bookingData.endTime
        };
        yield globals_1.db.deleteHour(reservedHout);
        // Return 200 OK for successful booking
        res.status(200).json({ message: 'Booking successful', bookingData });
    }
    catch (error) {
        // Handle database errors
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Endpoint to get available hours
app.get('/hours', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve available hours from the database or another source
        let availableHours = [];
        availableHours = yield globals_1.db.getHours();
        let services = [];
        services = yield globals_1.db.getServices();
        console.log(services);
        // Return the array of available hours
        res.status(200).json(availableHours);
    }
    catch (error) {
        // Handle errors, such as database errors
        console.error('Error fetching available hours:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Endpoint to get services
app.get('/services', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve available hours from the database or another source
        let services = [];
        services = yield globals_1.db.getServices();
        // Return the array of available hours
        res.status(200).json(services);
    }
    catch (error) {
        // Handle errors, such as database errors
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
