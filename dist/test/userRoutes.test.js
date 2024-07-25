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
// Create an instance of express with routing-controllers
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
    it('should register a user', () => __awaiter(void 0, void 0, void 0, function* () {
        register.mockImplementation((req, res) => {
            res.status(201).json(Object.assign({ id: 1 }, req.body));
        });
        const response = yield (0, supertest_1.default)(app)
            .post('/register')
            .send({
            username: 'testuser',
            password: 'password',
            role: 'user',
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('username', 'testuser');
    }));
    it('should login a user', () => __awaiter(void 0, void 0, void 0, function* () {
        login.mockImplementation((req, res) => {
            res.status(200).json({ token: 'mock-token' });
        });
        const response = yield (0, supertest_1.default)(app)
            .post('/login')
            .send({
            username: 'testuser',
            password: 'password',
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token', 'mock-token');
    }));
});
