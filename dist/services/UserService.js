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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const logger_1 = __importDefault(require("../config/logger"));
class UserService {
    register(req, res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password, role } = body;
                // Check if the username already exists
                const existingUser = yield User_1.default.findOne({ where: { username } });
                if (existingUser) {
                    throw new Error('Username already exists');
                }
                // Hash the password
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                // Create a new user
                const user = yield User_1.default.create({ username, password: hashedPassword, role });
                // Return the user
                return user;
            }
            catch (error) {
                logger_1.default.error(`Error registering user: ${error.message || error}`);
                // Handle unique constraint error
                if (error.name === 'SequelizeUniqueConstraintError') {
                    res.status(400).json({ message: 'Username already exists' });
                }
                else {
                    if (!res.headersSent) {
                        res.status(500).json({ error: 'Internal Server Error' });
                    }
                }
                throw error;
            }
        });
    }
    login(req, res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = body;
                const user = yield User_1.default.findOne({ where: { username } });
                if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
                    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    if (!res.headersSent) {
                        res.status(200).json({ token });
                    }
                    logger_1.default.info(`User logged in: ${username}`);
                }
                else {
                    if (!res.headersSent) {
                        res.status(401).json({ error: 'Invalid credentials' });
                    }
                    logger_1.default.warn(`Invalid login attempt: ${username}`);
                }
            }
            catch (error) {
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
                logger_1.default.error(`Error logging in user: ${error.message || error}`);
            }
        });
    }
}
exports.default = new UserService();
