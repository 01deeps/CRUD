"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserController = void 0;
const routing_controllers_1 = require("routing-controllers");
const UserService_1 = __importDefault(require("../services/UserService"));
const logger_1 = __importDefault(require("../config/logger"));
let UserController = class UserController {
    register(req, res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info('Registering user');
                const user = yield UserService_1.default.register(body);
                logger_1.default.info('User registered successfully', user);
                res.status(201).json(user);
            }
            catch (error) {
                logger_1.default.error('Error registering user', error);
                res.status(500).json({ message: 'Error registering user. Please try again later.' });
            }
        });
    }
    login(req, res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info('User login attempt');
                const { token } = yield UserService_1.default.login(body);
                logger_1.default.info('User logged in successfully');
                res.status(200).json({ token });
            }
            catch (error) {
                logger_1.default.warn('Invalid login attempt', error);
                res.status(401).json({ message: 'Invalid credentials. Please check your username and password.' });
            }
        });
    }
};
__decorate([
    (0, routing_controllers_1.Post)('/register'),
    __param(0, (0, routing_controllers_1.Req)()),
    __param(1, (0, routing_controllers_1.Res)()),
    __param(2, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, routing_controllers_1.Post)('/login'),
    __param(0, (0, routing_controllers_1.Req)()),
    __param(1, (0, routing_controllers_1.Res)()),
    __param(2, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
UserController = __decorate([
    (0, routing_controllers_1.JsonController)()
], UserController);
exports.UserController = UserController;
