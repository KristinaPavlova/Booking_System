"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingSchema = void 0;
// src/schema.ts
exports.bookingSchema = {
    type: 'object',
    properties: {
        services: { type: 'array', items: { type: 'string' }, minItems: 1 },
        startTime: { type: 'string' },
        endTime: { type: 'string' },
        totalAmount: { type: 'number' },
        name: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        address: { type: 'string' },
    },
    required: ['services', 'startTime', 'endTime', 'totalAmount', 'name', 'email', 'phone', 'address'],
    additionalProperties: false,
};
