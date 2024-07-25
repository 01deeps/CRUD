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
const Event_1 = __importDefault(require("../models/Event"));
class EventService {
    constructor() {
        this.createEvent = (eventData, userId) => __awaiter(this, void 0, void 0, function* () {
            console.log('createEvent called');
            console.log('Request Body:', eventData);
            try {
                if (!eventData) {
                    throw new Error('Request body is missing');
                }
                const { event_name, date, description } = eventData;
                if (!event_name || !date || !description) {
                    throw new Error('Missing required fields');
                }
                const event = yield Event_1.default.create({ event_name, date, description, userId });
                console.log('Event created:', event);
                // Return only relevant data
                return {
                    id: event.id,
                    event_name: event.event_name,
                    date: event.date,
                    description: event.description,
                    userId: event.userId,
                };
            }
            catch (error) {
                console.log('Error creating event:', error);
                throw new Error('Internal Server Error');
            }
        });
        this.getEvents = (userRole) => __awaiter(this, void 0, void 0, function* () {
            console.log('getEvents called');
            try {
                if (userRole !== 'admin') {
                    throw new Error('Access denied');
                }
                const events = yield Event_1.default.findAll();
                console.log('Events fetched:', events);
                // Return only relevant data
                return events.map(event => ({
                    id: event.id,
                    event_name: event.event_name,
                    date: event.date,
                    description: event.description,
                    userId: event.userId,
                }));
            }
            catch (error) {
                console.log('Error fetching events:', error);
                throw new Error('Internal Server Error');
            }
        });
        this.updateEvent = (id, eventData, userId, userRole) => __awaiter(this, void 0, void 0, function* () {
            console.log('updateEvent called');
            console.log('Request Params:', { id });
            console.log('Request Body:', eventData);
            try {
                const { event_name, date, description } = eventData;
                if (!event_name || !date || !description) {
                    throw new Error('Missing required fields');
                }
                const event = yield Event_1.default.findByPk(id);
                if (event && (event.userId === userId || userRole === 'admin')) {
                    event.event_name = event_name;
                    event.date = date;
                    event.description = description;
                    yield event.save();
                    console.log('Event updated:', event);
                    // Return only relevant data
                    return {
                        message: 'Event updated',
                        id: event.id,
                        event_name: event.event_name,
                        date: event.date,
                        description: event.description,
                        userId: event.userId,
                    };
                }
                else {
                    throw new Error('Event not found or unauthorized access');
                }
            }
            catch (error) {
                console.log('Error updating event:', error);
                throw new Error('Internal Server Error');
            }
        });
        this.deleteEvent = (id, userId, userRole) => __awaiter(this, void 0, void 0, function* () {
            console.log('deleteEvent called');
            console.log('Request Params:', { id });
            try {
                const event = yield Event_1.default.findByPk(id);
                if (event && (event.userId === userId || userRole === 'admin')) {
                    yield event.destroy();
                    console.log('Event deleted:', id);
                    // Return only relevant data
                    return {
                        message: 'Event deleted',
                        id,
                    };
                }
                else {
                    throw new Error('Event not found or unauthorized access');
                }
            }
            catch (error) {
                console.log('Error deleting event:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
}
exports.default = new EventService();
