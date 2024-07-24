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
const Event_1 = __importDefault(require("../models/Event")); // Import your Event model
class EventController {
    constructor() {
        this.createEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('createEvent called');
            console.log('Request Body:', req.body);
            try {
                const { event_name, date, description } = req.body;
                const event = yield Event_1.default.create({ event_name, date, description, userId: req.user.id }); // Assume req.user.id is set by auth middleware
                console.log('Event created:', event);
                res.status(201).json(event); // Send the event details in the response
            }
            catch (error) {
                console.log('Error creating event:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        this.getEvents = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('getEvents called');
            try {
                const events = yield Event_1.default.findAll();
                console.log('Events fetched:', events);
                res.status(200).json(events); // Send the list of events in the response
            }
            catch (error) {
                console.log('Error fetching events:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        this.updateEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('updateEvent called');
            console.log('Request Body:', req.body);
            try {
                const { id } = req.params;
                const { event_name, date, description } = req.body;
                const event = yield Event_1.default.findByPk(id);
                if (event && (event.userId === req.user.id || req.user.role === 'admin')) {
                    event.event_name = event_name;
                    event.date = date;
                    event.description = description;
                    yield event.save();
                    console.log('Event updated:', event);
                    res.status(200).json(event); // Send the updated event details in the response
                }
                else {
                    console.log('Event not found or unauthorized access');
                    res.status(404).json({ error: 'Event not found or unauthorized access' });
                }
            }
            catch (error) {
                console.log('Error updating event:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        this.deleteEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('deleteEvent called');
            console.log('Request Params:', req.params);
            try {
                const { id } = req.params;
                const event = yield Event_1.default.findByPk(id);
                if (event && (event.userId === req.user.id || req.user.role === 'admin')) {
                    yield event.destroy();
                    console.log('Event deleted:', id);
                    res.status(200).json({ message: 'Event deleted', id }); // Send event ID in response for confirmation
                }
                else {
                    console.log('Event not found or unauthorized access');
                    res.status(404).json({ error: 'Event not found or unauthorized access' });
                }
            }
            catch (error) {
                console.log('Error deleting event:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.default = new EventController();
