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
const UserController_1 = require("../controllers/UserController");
const dotenv_1 = __importDefault(require("dotenv"));
// jest.setup.ts
require("reflect-metadata");
// Load environment variables from a .env file
dotenv_1.default.config();
// Create a custom express server instance
const app = (0, routing_controllers_1.createExpressServer)({
    controllers: [UserController_1.UserController],
    defaultErrorHandler: false,
});
// Mock UserService methods
jest.mock('../services/UserService', () => ({
    __esModule: true,
    default: {
        register: jest.fn(),
        login: jest.fn(),
    },
}));
const { register, login } = require('../services/UserService').default;
describe('User Routes', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });
    it('should register a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = { username: 'testuser', password: 'password', role: 'user' };
        const expectedResponse = Object.assign({ id: 1 }, userData);
        register.mockResolvedValue(expectedResponse);
        const response = yield (0, supertest_1.default)(app)
            .post('/register')
            .send(userData);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(expectedResponse);
    }));
    it('should login a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginData = { username: 'testuser', password: 'password' };
        const expectedResponse = { token: 'mock-token' };
        login.mockResolvedValue(expectedResponse);
        const response = yield (0, supertest_1.default)(app)
            .post('/login')
            .send(loginData);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedResponse);
    }));
});
