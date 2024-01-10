import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { db } from './globals';
import { bookingRequest, bookingSchema } from './packet-interfaces/incomming';
import { AvailableHour, ServiceListItem, Email } from './packet-interfaces/outgoing';
import { sendEmail } from './handlers/email-handler';
const cors = require('cors');

process.env.TZ = 'UTC'; 
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const ajv = new Ajv({ allErrors: true, useDefaults: true });
addFormats(ajv);

//validation for booking request packet
const validateBooking = ajv.compile(bookingSchema);

// Endpoint to book a specific hour
app.post('/bookings', async (req: Request, res: Response) => {
    const bookingData = req.body as bookingRequest;

    // Validate the input against the schema
    const isValid = validateBooking(bookingData);

    console.log("Receive booking request: ", bookingData);

    if (!isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validateBooking.errors });
    }
    console.log("Receive booking request: ", bookingData);

    try {
        // Insert booking data into the database using the DbHandler
        await db.insertBooking(bookingData);
        
        const email: Email = {
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

        sendEmail(email);
        const reservedHout: AvailableHour = {
            startTime: bookingData.startTime,
            endTime: bookingData.endTime
        }
        await db.deleteHour(reservedHout);
        // Return 200 OK for successful booking
        res.status(200).json({ message: 'Booking successful', bookingData });
      } catch (error) {
        // Handle database errors
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to get available hours
app.get('/hours', async (req: Request, res: Response) => {
    try {
        // Retrieve available hours from the database or another source
        let availableHours: AvailableHour[] = [];
        availableHours = await db.getHours();

        let services: ServiceListItem[] = [];
        services = await db.getServices();
        console.log(services);

        // Return the array of available hours
        res.status(200).json(availableHours);
    } catch (error) {
        // Handle errors, such as database errors
        console.error('Error fetching available hours:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to get services
app.get('/services', async (req: Request, res: Response) => {
    try {
        // Retrieve available hours from the database or another source
        let services: ServiceListItem[] = [];
        services = await db.getServices();

        // Return the array of available hours
        res.status(200).json(services);
    } catch (error) {
        // Handle errors, such as database errors
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

