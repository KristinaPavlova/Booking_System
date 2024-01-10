"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
// Import necessary modules
const axios_1 = __importDefault(require("axios"));
// Define the server endpoint
const serverEndpoint = 'https://api.elasticemail.com/v4/emails';
// Define your authorization token
const authToken = process.env.TOKEN;
// Set up the headers with the authorization token
const headers = {
    'X-ElasticEmail-ApiKey': authToken,
    'Content-Type': 'application/json',
};
function sendEmail(postData) {
    // Send POST request using Axios with authorization header
    axios_1.default.post(serverEndpoint, postData, { headers })
        .then((response) => {
        // Handle the response data
        console.log('Response:', response.data);
    })
        .catch((error) => {
        // Handle errors
        console.error('Error:', error.message);
    });
}
exports.sendEmail = sendEmail;
