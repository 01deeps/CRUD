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
const supertest_1 = __importDefault(require("supertest"));
const routing_controllers_1 = require("routing-controllers");
const EventController_1 = require("../controllers/EventController");
const auth_1 = __importDefault(require("../middleware/auth"));
// Create a custom express server instance
const app = (0, routing_controllers_1.createExpressServer)({
    controllers: [EventController_1.EventController],
    middlewares: [auth_1.default.authenticateJWT, auth_1.default.authorizeRoles('user', 'admin')],
    defaultErrorHandler: false,
});
// Mock EventController methods
jest.mock('../controllers/EventController', () => ({
    __esModule: true,
    default: {
        createEvent: jest.fn(),
        getEvents: jest.fn(),
        updateEvent: jest.fn(),
        deleteEvent: jest.fn(),
    },
}));
const { createEvent, getEvents, updateEvent, deleteEvent } = require('../controllers/EventController').default;
describe('Event Routes with Mocked Middleware', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });
    it('should create an event', () => __awaiter(void 0, void 0, void 0, function* () {
        createEvent.mockImplementation((req, res) => {
            res.status(201).json(Object.assign({ id: 1 }, req.body));
        });
        const response = yield (0, supertest_1.default)(app)
            .post('/events')
            .send({
            event_name: 'New Event',
            date: new Date(),
            description: 'New Event Description',
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('event_name', 'New Event');
        expect(response.body).toHaveProperty('description', 'New Event Description');
    }));
    it('should get all events', () => __awaiter(void 0, void 0, void 0, function* () {
        getEvents.mockImplementation((req, res) => {
            res.status(200).json([{ id: 1, event_name: 'Event 1', description: 'Description 1' }]);
        });
        const response = yield (0, supertest_1.default)(app).get('/events');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    }));
    it('should update an event', () => __awaiter(void 0, void 0, void 0, function* () {
        updateEvent.mockImplementation((req, res) => {
            res.status(200).json(Object.assign({ id: req.params.id }, req.body));
        });
        const response = yield (0, supertest_1.default)(app)
            .put('/events/1')
            .send({
            event_name: 'Updated Event',
            date: new Date(),
            description: 'Updated Description',
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', '1');
        expect(response.body).toHaveProperty('event_name', 'Updated Event');
        expect(response.body).toHaveProperty('description', 'Updated Description');
    }));
    it('should delete an event', () => __awaiter(void 0, void 0, void 0, function* () {
        deleteEvent.mockImplementation((req, res) => {
            res.status(200).json({ message: 'Event deleted' });
        });
        const response = yield (0, supertest_1.default)(app).delete('/events/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Event deleted');
    }));
});
