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
const express_1 = __importDefault(require("express"));
const routing_controllers_1 = require("routing-controllers");
const database_1 = require("./config/database");
const EventController_1 = require("./controllers/EventController");
const UserController_1 = require("./controllers/UserController");
const auth_1 = __importDefault(require("./middleware/auth"));
require("reflect-metadata");
class Server {
    constructor(port) {
        this.port = port;
        this.app = (0, routing_controllers_1.createExpressServer)({
            controllers: [EventController_1.EventController, UserController_1.UserController],
            middlewares: [auth_1.default.authenticateJWT, auth_1.default.authorizeRoles('user', 'admin')],
            defaultErrorHandler: false,
        });
        this.configureMiddleware();
        this.configureErrorHandling();
    }
    configureMiddleware() {
        this.app.use(express_1.default.json()); // Ensure this is before any routes
    }
    configureErrorHandling() {
        this.app.use((err, req, res, next) => {
            console.error('Internal Server Error:', err.stack);
            if (!res.headersSent) {
                res.status(500).send('Internal Server Error');
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.database.connect();
            this.app.listen(this.port, () => {
                console.log(`Server is running on http://localhost:${this.port}`);
            });
        });
    }
}
const server = new Server(3000);
server.start();
exports.default = server;
