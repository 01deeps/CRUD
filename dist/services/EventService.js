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
            throw new Error('No token provided');
        }
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = this.verifyToken(req);
                const { event_name, date, description } = req.body;
                const event = yield Event_1.default.create({ event_name, date, description, userId: decoded.id });
                res.status(201).json(event);
                logger_1.default.info(`Event created successfully by user: ${decoded.id}`, { event });
            }
            catch (error) {
                logger_1.default.error('Error creating event', { error });
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const events = yield Event_1.default.findAll();
                logger_1.default.info('Fetched all events', { events });
                res.status(200).json(events);
            }
            catch (error) {
                logger_1.default.error('Error fetching events', { error });
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    updateEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = this.verifyToken(req);
                const { id } = req.params;
                const { event_name, date, description } = req.body;
                const event = yield Event_1.default.findByPk(id);
                if (event && (event.userId === decoded.id || decoded.role === 'admin')) {
                    event.event_name = event_name;
                    event.date = date;
                    event.description = description;
                    yield event.save();
                    logger_1.default.info('Event updated successfully', { event });
                    res.status(200).json(event);
                }
                else {
                    logger_1.default.warn('Event not found or unauthorized access', { id });
                    res.status(404).json({ error: 'Event not found or unauthorized access' });
                }
            }
            catch (error) {
                logger_1.default.error('Error updating event', { error });
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = this.verifyToken(req);
                const { id } = req.params;
                const event = yield Event_1.default.findByPk(id);
                if (event && (event.userId === decoded.id || decoded.role === 'admin')) {
                    yield event.destroy();
                    logger_1.default.info('Event deleted successfully', { id });
                    res.status(200).json({ message: 'Event deleted' });
                }
                else {
                    logger_1.default.warn('Event not found or unauthorized access', { id });
                    res.status(404).json({ error: 'Event not found or unauthorized access' });
                }
            }
            catch (error) {
                logger_1.default.error('Error deleting event', { error });
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.default = new EventService();
