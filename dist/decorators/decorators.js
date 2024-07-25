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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorized = exports.Authenticated = void 0;
// Authentication Decorator
function Authenticated(target, key, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Authentication logic
                if (!req.headers.authorization) {
                    return res.status(401).json({ error: 'No token provided' });
                }
                // Call the original method
                yield originalMethod.apply(this, [req, res, next]);
            }
            catch (error) {
                res.status(401).json({ error: 'Unauthorized' });
            }
        });
    };
    return descriptor;
}
exports.Authenticated = Authenticated;
// Authorization Decorator
function Authorized(roles) {
    return function (target, key, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Authorization logic
                    const user = req.user;
                    if (!user || !roles.includes(user.role)) {
                        return res.status(403).json({ error: 'Forbidden' });
                    }
                    // Call the original method
                    yield originalMethod.apply(this, [req, res, next]);
                }
                catch (error) {
                    res.status(403).json({ error: 'Forbidden' });
                }
            });
        };
        return descriptor;
    };
}
exports.Authorized = Authorized;
