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
    authenticateJWT(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log('authenticateJWT: Start');
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (token) {
                try {
                    console.log('authenticateJWT: Token found');
                    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                    console.log('authenticateJWT: Token verified', decoded);
                    req.user = { role: decoded.role, id: decoded.id }; // Set req.user with the role and id
                    next();
                }
                catch (error) {
                    console.log('authenticateJWT: Invalid Token', error);
                    logger_1.default.warn('Invalid Token');
                    if (!res.headersSent) {
                        res.status(403).json({ error: 'Forbidden' }).end(); // Use end() to indicate no further processing
                    }
                }
            }
            else {
                console.log('authenticateJWT: No Token Provided');
                logger_1.default.warn('No Token Provided');
                if (!res.headersSent) {
                    res.status(401).json({ error: 'Unauthorized' }).end(); // Use end() to indicate no further processing
                }
            }
        });
    }
    authorizeRoles(...roles) {
        return (req, res, next) => {
            var _a, _b, _c;
            console.log('authorizeRoles: Start');
            console.log('authorizeRoles: Required roles', roles);
            console.log('authorizeRoles: User role', (_a = req.user) === null || _a === void 0 ? void 0 : _a.role);
            if (!req.user || !roles.includes(req.user.role)) {
                console.log(`authorizeRoles: User role ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.role} not authorized`);
                logger_1.default.warn(`User role ${(_c = req.user) === null || _c === void 0 ? void 0 : _c.role} not authorized`);
                if (!res.headersSent) {
                    res.status(403).json({ error: 'Unauthorized access' }).end(); // Use end() to indicate no further processing
                }
            }
            else {
                next();
            }
        };
    }
}
exports.default = new AuthMiddleware();
