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
// src/__tests__/eventRoutes.test.ts
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const eventRoutes_1 = __importDefault(require("../routes/eventRoutes"));
const EventController_1 = __importDefault(require("../controllers/EventController"));
// Create an instance of express and apply the routes
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Middleware to parse JSON bodies
app.use('/api', eventRoutes_1.default); // Apply event routes to the /api path
// Mock the controller methods
jest.mock('../controllers/EventController');
describe('Event Routes', () => {
    it('should create an event', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCreateEvent = EventController_1.default.createEvent;
        // Mock implementation of createEvent method
        mockCreateEvent.mockImplementation((req, res) => {
            res.status(201).json(Object.assign({ id: 1 }, req.body));
        });
        // Send a POST request to create an event
        const response = yield (0, supertest_1.default)(app)
            .post('/api/events')
            .send({
            event_name: 'New Event',
            date: new Date(),
            description: 'New Event Description',
        });
        // Assertions to check response status and body
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('event_name', 'New Event');
        expect(response.body).toHaveProperty('description', 'New Event Description');
    }));
    it('should get all events', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockGetEvents = EventController_1.default.getEvents;
        // Mock implementation of getEvents method
        mockGetEvents.mockImplementation((req, res) => {
            res.status(200).json([{ id: 1, event_name: 'Event 1', description: 'Description 1' }]);
        });
        // Send a GET request to retrieve all events
        const response = yield (0, supertest_1.default)(app).get('/api/events');
        // Assertions to check response status and body
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    }));
    it('should update an event', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUpdateEvent = EventController_1.default.updateEvent;
        // Mock implementation of updateEvent method
        mockUpdateEvent.mockImplementation((req, res) => {
            res.status(200).json(Object.assign({ id: req.params.id }, req.body));
        });
        // Send a PUT request to update an event
        const response = yield (0, supertest_1.default)(app)
            .put('/api/events/1')
            .send({
            event_name: 'Updated Event',
            date: new Date(),
            description: 'Updated Description',
        });
        // Assertions to check response status and body
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', '1');
        expect(response.body).toHaveProperty('event_name', 'Updated Event');
        expect(response.body).toHaveProperty('description', 'Updated Description');
    }));
    it('should delete an event', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockDeleteEvent = EventController_1.default.deleteEvent;
        // Mock implementation of deleteEvent method
        mockDeleteEvent.mockImplementation((req, res) => {
            res.status(200).json({ message: 'Event deleted' });
        });
        // Send a DELETE request to delete an event
        const response = yield (0, supertest_1.default)(app).delete('/api/events/1');
        // Assertions to check response status and body
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Event deleted');
    }));
});
