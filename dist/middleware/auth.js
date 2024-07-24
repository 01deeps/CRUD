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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../config/logger"));
class AuthMiddleware {
    constructor() {
        this.authenticateJWT = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (token) {
                try {
                    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                    req.user = decoded;
                    next();
                }
                catch (error) {
                    logger_1.default.warn('Invalid Token');
                    res.status(403).json({ error: 'Forbidden' });
                }
            }
            else {
                logger_1.default.warn('No Token Provided');
                res.status(401).json({ error: 'Unauthorized' });
            }
        });
        this.authorizeRoles = (...roles) => {
            return (req, res, next) => {
                if (!roles.includes(req.user.role)) {
                    logger_1.default.warn(`User role ${req.user.role} not authorized`);
                    res.status(403).json({ error: 'Forbidden' });
                }
                else {
                    next();
                }
            };
        };
    }
}
const authMiddleware = new AuthMiddleware();
exports.default = authMiddleware;
