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
const logger_1 = __importDefault(require("../config/logger"));
//EventService class to handle CRUD operations for events
class EventService {
    //Create a new event
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { event_name, date, description } = req.body; // Destructure event details from request body
                const event = yield Event_1.default.create({ event_name, date, description }); // Create new event
                logger_1.default.info('Event created successfully', { event }); // Log success
                res.status(201).json(event); // Send created event as response
            }
            catch (error) {
                logger_1.default.error('Error creating event', { error }); // Log error
                res.status(500).json({ error: 'Internal Server Error' }); // Send error response
            }
        });
    }
    //Fetch all events 
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const events = yield Event_1.default.findAll(); // Retrieve all events
                logger_1.default.info('Fetched all events', { events }); // Log success
                res.status(200).json(events); // Send events as response
            }
            catch (error) {
                logger_1.default.error('Error fetching events', { error }); // Log error
                res.status(500).json({ error: 'Internal Server Error' }); // Send error response
            }
        });
    }
    // Update an event by ID
    updateEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // Extract event ID from request parameters
                const { event_name, date, description } = req.body; // Extract updated details from request body
                const event = yield Event_1.default.findByPk(id); // Find event by ID
                if (event) {
                    // Update event details
                    event.event_name = event_name;
                    event.date = date;
                    event.description = description;
                    yield event.save(); // Save changes to database
                    logger_1.default.info('Event updated successfully', { event }); // Log success
                    res.status(200).json(event); // Send updated event as response
                }
                else {
                    logger_1.default.warn('Event not found', { id }); // Log warning
                    res.status(404).json({ error: 'Event not found' }); // Send not found response
                }
            }
            catch (error) {
                logger_1.default.error('Error updating event', { error }); // Log error
                res.status(500).json({ error: 'Internal Server Error' }); // Send error response
            }
        });
    }
    //Delete an event by ID
    deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // Extract event ID from request parameters
                const event = yield Event_1.default.findByPk(id); // Find event by ID
                if (event) {
                    yield event.destroy(); // Delete event from database
                    logger_1.default.info('Event deleted successfully', { id }); // Log success
                    res.status(200).json({ message: 'Event deleted' }); // Send success response
                }
                else {
                    logger_1.default.warn('Event not found', { id }); // Log warning
                    res.status(404).json({ error: 'Event not found' }); // Send not found response
                }
            }
            catch (error) {
                logger_1.default.error('Error deleting event', { error }); // Log error
                res.status(500).json({ error: 'Internal Server Error' }); // Send error response
            }
        });
    }
}
// Export a new instance of EventService
exports.default = new EventService();
