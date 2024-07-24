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
// src/__tests__/userRoutes.test.ts
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const UserService_1 = __importDefault(require("../services/UserService"));
// Create an instance of express and apply the routes
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Middleware to parse JSON bodies
app.use('/api', userRoutes_1.default); // Apply user routes to the /api path
// Mock the service methods
jest.mock('../services/UserService');
describe('User Routes', () => {
    it('should register a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockRegister = UserService_1.default.register;
        mockRegister.mockImplementation((req, res) => {
            res.status(201).json(Object.assign({ id: 1 }, req.body));
        });
        const response = yield (0, supertest_1.default)(app)
            .post('/api/register')
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
        const mockLogin = UserService_1.default.login;
        mockLogin.mockImplementation((req, res) => {
            res.status(200).json({ token: 'mock-token' });
        });
        const response = yield (0, supertest_1.default)(app)
            .post('/api/login')
            .send({
            username: 'testuser',
            password: 'password',
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token', 'mock-token');
    }));
});
