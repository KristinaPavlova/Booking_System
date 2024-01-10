import { Address } from "cluster";

// src/schema.ts
export const bookingSchema = {
    type: 'object',
    properties: {
      services: { type: 'array', items: { type: 'string' }, minItems: 1 },
      startTime: { type: 'string'},
      endTime: { type: 'string'},
      totalAmount: { type: 'number' },
      name: { type: 'string' },
      email: { type: 'string'},
      phone: { type: 'string'},
      address: { type: 'string' },
    },
    required: ['services', 'startTime', 'endTime', 'totalAmount', 'name', 'email', 'phone', 'address'],
    additionalProperties: false,
};

export interface bookingRequest {
    services: string[]
    startTime: string
    endTime: string
    totalAmount: number
    name: string
    email: string
    phone: string
    address: string
}
  