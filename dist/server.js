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
const body_parser_1 = __importDefault(require("body-parser"));
const database_1 = require("./config/database");
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
class Server {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.configureMiddleware();
        this.configureRoutes();
        this.configureErrorHandling();
    }
    configureMiddleware() {
        this.app.use(body_parser_1.default.json());
    }
    configureRoutes() {
        this.app.use('/api/work', eventRoutes_1.default);
        this.app.use('/api', userRoutes_1.default);
    }
    configureErrorHandling() {
        this.app.use((err, req, res, next) => {
            console.error('Internal Server Error:', err.stack);
            res.status(500).send('Internal Server Error');
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
