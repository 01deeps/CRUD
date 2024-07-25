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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Event_1 = __importDefault(require("../models/Event"));
class EventService {
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
                // Assuming req.user is set by authentication middleware and contains user details
                if (req.user.role !== 'admin') {
                    console.log('Access denied: non-admin user attempted to fetch events');
                    res.status(403).json({ error: 'Access denied' });
                }
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
                    res.status(200).json({ message: 'Updated event', id }); // Send the updated event details in the response
                }
                else {
                    console.log('Event not found or unauthorized access');
                    res.status(404).json({ error: 'Unauthorized access' });
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
                    res.status(404).json({ error: 'Unauthorized access' });
                }
            }
            catch (error) {
                console.log('Error deleting event:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    verifyToken(req) {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            console.log('No token provided');
            throw new Error('No token provided');
        }
        console.log('Token provided:', token);
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
}
exports.default = new EventService();
