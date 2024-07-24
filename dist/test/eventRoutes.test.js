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
const express_1 = __importDefault(require("express"));
const eventRoutes_1 = __importDefault(require("../routes/eventRoutes"));
const EventController_1 = __importDefault(require("../controllers/EventController"));
// Create an instance of express and apply the routes
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Middleware to parse JSON bodies
app.use('/api', eventRoutes_1.default); // Apply event routes to the /api path
// Mock middleware with console logs
jest.mock('../middleware/auth', () => ({
    __esModule: true,
    authenticateJWT: (req, res, next) => {
        console.log('authenticateJWT called');
        next();
    },
    authorizeRoles: (roles) => (req, res, next) => {
        console.log(`authorizeRoles called with roles: ${roles}`);
        next();
    },
}));
// Mock EventController methods
jest.mock('../controllers/EventController', () => ({
    __esModule: true,
    default: {
        createEvent: jest.fn(),
        getEvents: jest.fn(),
        updateEvent: jest.fn(),
        deleteEvent: jest.fn()
    }
}));
describe('Event Routes', () => {
    const mockCreateEvent = EventController_1.default.createEvent;
    const mockGetEvents = EventController_1.default.getEvents;
    const mockUpdateEvent = EventController_1.default.updateEvent;
    const mockDeleteEvent = EventController_1.default.deleteEvent;
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('should create an event', () => __awaiter(void 0, void 0, void 0, function* () {
        mockCreateEvent.mockImplementation((req, res) => {
            res.status(201).json(Object.assign({ id: 1 }, req.body));
        });
        const response = yield (0, supertest_1.default)(app)
            .post('/api/events')
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
        mockGetEvents.mockImplementation((req, res) => {
            res.status(200).json([{ id: 1, event_name: 'Event 1', description: 'Description 1' }]);
        });
        const response = yield (0, supertest_1.default)(app).get('/api/events');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    }));
    it('should update an event', () => __awaiter(void 0, void 0, void 0, function* () {
        mockUpdateEvent.mockImplementation((req, res) => {
            res.status(200).json(Object.assign({ id: req.params.id }, req.body));
        });
        const response = yield (0, supertest_1.default)(app)
            .put('/api/events/1')
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
        mockDeleteEvent.mockImplementation((req, res) => {
            res.status(200).json({ message: 'Event deleted' });
        });
        const response = yield (0, supertest_1.default)(app).delete('/api/events/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Event deleted');
    }));
    // Test cases for unauthorized access
    it('should return 401 for create event without auth', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock middleware to simulate authentication failure
        jest.mock('../middleware/auth', () => ({
            __esModule: true,
            authenticateJWT: (req, res, next) => {
                console.log('authenticateJWT called - unauthorized');
                res.status(401).json({ error: 'Unauthorized' });
            },
            authorizeRoles: (roles) => (req, res, next) => next(),
        }));
        const response = yield (0, supertest_1.default)(app)
            .post('/api/events')
            .send({
            event_name: 'New Event',
            date: new Date(),
            description: 'New Event Description',
        });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Unauthorized');
    }));
    it('should return 403 for unauthorized role', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock middleware to simulate role-based access control failure
        jest.mock('../middleware/auth', () => ({
            __esModule: true,
            authenticateJWT: (req, res, next) => next(),
            authorizeRoles: (roles) => (req, res, next) => {
                console.log(`authorizeRoles called with roles: ${roles} - forbidden`);
                res.status(403).json({ error: 'Forbidden' });
            },
        }));
        const response = yield (0, supertest_1.default)(app).delete('/api/events/1');
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error', 'Forbidden');
    }));
});
