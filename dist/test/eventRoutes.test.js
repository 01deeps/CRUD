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
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', eventRoutes_1.default);
jest.mock('../controllers/EventController', () => ({
    __esModule: true,
    default: {
        createEvent: jest.fn(),
        getEvents: jest.fn(),
        updateEvent: jest.fn(),
        deleteEvent: jest.fn(),
    },
}));
const { createEvent, getEvents, updateEvent, deleteEvent } = EventController_1.default;
describe('Event Routes with Mocked Middleware', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
        jest.mock('../middleware/auth', () => ({
            __esModule: true,
            default: {
                authenticateJWT: (req, res, next) => {
                    console.log('Mocked authenticateJWT middleware');
                    req.user = { id: 1, role: 'user' };
                    next();
                },
                authorizeRoles: (...roles) => (req, res, next) => {
                    console.log('Mocked authorizeRoles middleware');
                    if (roles.includes(req.user.role)) {
                        next();
                    }
                    else {
                        res.status(403).json({ error: 'Forbidden' });
                    }
                },
            },
        }));
    });
    it('should create an event', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Test: Create Event');
        createEvent.mockImplementation((req, res) => {
            console.log('Mocked createEvent controller');
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
        console.log('Test: Get All Events');
        getEvents.mockImplementation((req, res) => {
            console.log('Mocked getEvents controller');
            res.status(200).json([{ id: 1, event_name: 'Event 1', description: 'Description 1' }]);
        });
        const response = yield (0, supertest_1.default)(app).get('/api/events');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    }));
    it('should update an event by user who created it', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Test: Update Event');
        updateEvent.mockImplementation((req, res) => {
            console.log('Mocked updateEvent controller');
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
    it('should delete an event by admin', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Test: Delete Event by Admin');
        jest.mock('../middleware/auth', () => ({
            __esModule: true,
            default: {
                authenticateJWT: (req, res, next) => {
                    console.log('Mocked authenticateJWT middleware');
                    req.user = { id: 1, role: 'admin' };
                    next();
                },
                authorizeRoles: (...roles) => (req, res, next) => {
                    console.log('Mocked authorizeRoles middleware');
                    if (roles.includes(req.user.role)) {
                        next();
                    }
                    else {
                        res.status(403).json({ error: 'Forbidden' });
                    }
                },
            },
        }));
        deleteEvent.mockImplementation((req, res) => {
            console.log('Mocked deleteEvent controller');
            res.status(200).json({ message: 'Event deleted' });
        });
        const response = yield (0, supertest_1.default)(app).delete('/api/events/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Event deleted');
    }));
});
