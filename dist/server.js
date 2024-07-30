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
const typedi_1 = require("typedi");
const database_1 = require("./config/database");
const auth_1 = __importDefault(require("./middleware/auth"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("./config/logger"));
require("reflect-metadata");
// Use typedi container
(0, routing_controllers_1.useContainer)(typedi_1.Container);
class Server {
    constructor(port) {
        this.port = port;
        // Dynamically load controllers
        const controllers = this.loadControllers(path_1.default.join(__dirname, 'controllers'));
        this.app = (0, routing_controllers_1.createExpressServer)({
            controllers: controllers,
            middlewares: [auth_1.default.authenticateJWT, auth_1.default.authorizeRoles('user', 'admin')],
            defaultErrorHandler: true, // Enable default error handler
        });
        this.configureMiddleware();
        this.configureErrorHandling();
    }
    configureMiddleware() {
        this.app.use(express_1.default.json()); // Ensure this is before any routes
    }
    configureErrorHandling() {
        this.app.use((err, req, res, next) => {
            logger_1.default.error(`Internal Server Error: ${err.stack}`);
            if (!res.headersSent) {
                res.status(500).send('Internal Server Error');
            }
        });
    }
    loadControllers(controllersPath) {
        const controllers = [];
        fs_1.default.readdirSync(controllersPath).forEach(file => {
            if (file.endsWith('.ts') || file.endsWith('.js')) {
                const controller = require(path_1.default.join(controllersPath, file)).default || require(path_1.default.join(controllersPath, file));
                if (controller) {
                    controllers.push(controller);
                }
            }
        });
        return controllers;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.database.connect();
                this.app.listen(this.port, () => {
                    logger_1.default.info(`Server is running on http://localhost:${this.port}`);
                });
            }
            catch (error) {
                logger_1.default.error('Failed to start server:', error);
            }
        });
    }
}
const server = new Server(3000);
server.start();
exports.default = server;
