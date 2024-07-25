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
const logger_1 = __importDefault(require("../config/logger"));
class EventService {
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
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('createEvent called');
            try {
                const decoded = this.verifyToken(req);
                console.log('Token decoded:', decoded);
                const { event_name, date, description } = req.body;
                console.log('Request body:', req.body);
                const event = yield Event_1.default.create({ event_name, date, description, userId: decoded.id });
                // const event = await Event.create({ event_name, date, description, userId: decoded.id });
                console.log('Event created:', event);
                res.status(201).json(event);
                logger_1.default.info(`Event created successfully by user: ${decoded.id}`, { event });
            }
            catch (error) {
                console.log('Error creating event:', error);
                logger_1.default.error('Error creating event', { error });
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getEvents called');
            try {
                const events = yield Event_1.default.findAll();
                console.log('Events fetched:', events);
                logger_1.default.info('Fetched all events', { events });
                res.status(200).json(events);
            }
            catch (error) {
                console.log('Error fetching events:', error);
                logger_1.default.error('Error fetching events', { error });
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    updateEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('updateEvent called');
            try {
                const decoded = this.verifyToken(req);
                console.log('Token decoded:', decoded);
                const { id } = req.params;
                const { event_name, date, description } = req.body;
                console.log('Request params:', req.params);
                console.log('Request body:', req.body);
                const event = yield Event_1.default.findByPk(id);
                if (event && (event.userId === decoded.id || decoded.role === 'admin' || decoded.role === 'user')) {
                    event.event_name = event_name;
                    event.date = date;
                    event.description = description;
                    yield event.save();
                    console.log('Event updated:', event);
                    logger_1.default.info('Event updated successfully', { event });
                    res.status(200).json(event);
                }
                else {
                    console.log('Event not found or unauthorized accesssssss');
                    logger_1.default.warn('Unauthorized access', { id });
                    res.status(404).json({ error: 'Unauthorized access' });
                }
            }
            catch (error) {
                console.log('Error updating event:', error);
                logger_1.default.error('Error updating event', { error });
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('deleteEvent called');
            try {
                const decoded = this.verifyToken(req);
                console.log('Token decoded:', decoded);
                const { id } = req.params;
                console.log('Request params:', req.params);
                const event = yield Event_1.default.findByPk(id);
                if (event && (event.userId === decoded.id || decoded.role === 'admin' || decoded.role === 'user')) {
                    yield event.destroy();
                    console.log('Event deleted:', id);
                    logger_1.default.info('Event deleted successfully', { id });
                    res.status(200).json({ message: 'Event deleted' });
                }
                else {
                    console.log('Event not found or unauthorized access');
                    logger_1.default.warn('Event not found or unauthorized access', { id });
                    res.status(404).json({ error: 'Event not found or unauthorized access' });
                }
            }
            catch (error) {
                console.log('Error deleting event:', error);
                logger_1.default.error('Error deleting event', { error });
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.default = new EventService();
