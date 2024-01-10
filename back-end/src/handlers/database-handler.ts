// db-handler.ts
import mysql from 'mysql2/promise';
import { bookingRequest } from '../packet-interfaces/incomming';
import { AvailableHour , ServiceListItem } from '../packet-interfaces/outgoing';
import { describe } from 'nats/lib/nats-base-client/parser';

class DbHandler {
  private connection: mysql.Connection;

  constructor(private dbConfig: mysql.PoolOptions) {
    this.connection = mysql.createPool(dbConfig);
  }

  async executeQuery(query: string, values?: any[]): Promise<any> {
    try {
      const [rows] = await this.connection.execute(query, values);
      return rows;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async insertBooking(bookingData: bookingRequest): Promise<void> {
    const transformedString: string = bookingData.services.map(str => `'${str}'`).join(', ');
    const query = `INSERT INTO Bookings 
                   (services, startTime, endTime, totalAmount, name, email, phone, address )
                   VALUES ('${bookingData.services}', '${new Date(bookingData.startTime).toISOString().slice(0, 19).replace('T', ' ')}' 
                   , '${new Date(bookingData.endTime).toISOString().slice(0, 19).replace('T', ' ')}' , ${bookingData.totalAmount}, '${bookingData.name}'
                        , '${bookingData.email}', '${bookingData.phone}', '${bookingData.address}')`;
    await this.executeQuery(query);
  }

  async deleteHour(data: AvailableHour): Promise<void> {
      const query = `DELETE 
                     FROM Hours 
                     WHERE startTime = '${data.startTime}'
                     AND endTime = '${data.endTime}'`;
      await this.executeQuery(query);
  }

  async getHours(): Promise<AvailableHour[]> {
    const query = `
        SELECT *
        FROM Hours;`;
    
    const hours = await this.executeQuery(query);
    const formattedHours: AvailableHour[] = hours.map(row => ({
        startTime: new Date(row.startTime).toISOString().slice(0, 19).replace('T', ' '),
        endTime: new Date(row.endTime).toISOString().slice(0, 19).replace('T', ' ')
    }));
    return formattedHours;
  }

  async getServices(): Promise<ServiceListItem[]> {
    const query = `
        SELECT *
        FROM Service;`;
    
    const services = await this.executeQuery(query);
    return services;
  }

  async closeConnection(): Promise<void> {
    await this.connection.end();
  }
}

export default DbHandler;
