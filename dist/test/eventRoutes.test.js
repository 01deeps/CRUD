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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Setting the secret for testing
process.env.JWT_SECRET = 'your-secret-key';
const generateToken = (role, userId) => {
    return jsonwebtoken_1.default.sign({ role, userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
const adminToken = generateToken('admin');
const userToken = generateToken('user', 1);
const app = (0, routing_controllers_1.createExpressServer)({
    controllers: [EventController_1.EventController],
    middlewares: [auth_1.default.authenticateJWT, auth_1.default.authorizeRoles('user', 'admin')],
    defaultErrorHandler: false,
});
// Mock EventService methods
jest.mock('../services/EventService', () => ({
    __esModule: true,
    default: {
        createEvent: jest.fn(),
        getEvents: jest.fn(),
        updateEvent: jest.fn(),
        deleteEvent: jest.fn(),
    },
}));
const { createEvent, getEvents, updateEvent, deleteEvent } = require('../services/EventService').default;
describe('Event Routes with Role-Based Access', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });
    const testCRUDOperations = (token, role, isAdmin) => {
        const eventData = {
            event_name: 'New Event',
            date: new Date().toISOString(),
            description: 'New Event Description',
        };
        const updatedEventData = {
            event_name: 'Updated Event',
            date: new Date().toISOString(),
            description: 'Updated Description',
        };
        const expectedResponse = {
            id: 1,
            event_name: updatedEventData.event_name,
            date: updatedEventData.date,
            description: updatedEventData.description,
        };
        it(`should allow ${role} to create an event`, () => __awaiter(void 0, void 0, void 0, function* () {
            createEvent.mockResolvedValue(Object.assign({ id: 1 }, eventData));
            const response = yield (0, supertest_1.default)(app)
                .post('/events')
                .set('Authorization', `Bearer ${token}`)
                .send(eventData);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(Object.assign({ id: 1 }, eventData));
        }));
        it(`should allow ${role} to update an event`, () => __awaiter(void 0, void 0, void 0, function* () {
            updateEvent.mockResolvedValue(expectedResponse);
            const response = yield (0, supertest_1.default)(app)
                .put('/events/1')
                .set('Authorization', `Bearer ${token}`)
                .send(updatedEventData);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expectedResponse);
        }));
        it(`should allow ${role} to delete an event`, () => __awaiter(void 0, void 0, void 0, function* () {
            deleteEvent.mockResolvedValue({ message: 'Event deleted' });
            const response = yield (0, supertest_1.default)(app)
                .delete('/events/1')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Event deleted' });
        }));
    };
    testCRUDOperations(adminToken, 'admin', true);
    testCRUDOperations(userToken, 'user', false);
});
