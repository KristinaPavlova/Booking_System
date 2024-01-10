// Import necessary modules
import axios, { AxiosResponse } from 'axios';
import { Email } from '../packet-interfaces/outgoing';

// Define the server endpoint
const serverEndpoint = 'https://api.elasticemail.com/v4/emails';
// Define your authorization token
const authToken = process.env.TOKEN;

// Set up the headers with the authorization token
const headers = {
  'X-ElasticEmail-ApiKey': authToken,
  'Content-Type': 'application/json',
};

export function sendEmail(postData: Email){
    // Send POST request using Axios with authorization header
    axios.post(serverEndpoint, postData, { headers })
        .then((response: AxiosResponse) => {
            // Handle the response data
            console.log('Response:', response.data);
        })
        .catch((error) => {
            // Handle errors
            console.error('Error:', error.message);
        });
}
