"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EventController_1 = __importDefault(require("../controllers/EventController"));
const auth_1 = __importDefault(require("../middleware/auth"));
class EventRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/events', auth_1.default.authenticateJWT, auth_1.default.authorizeRoles('user', 'admin'), EventController_1.default.createEvent);
        this.router.get('/events', auth_1.default.authenticateJWT, auth_1.default.authorizeRoles('user', 'admin'), EventController_1.default.getEvents);
        this.router.put('/events/:id', auth_1.default.authenticateJWT, auth_1.default.authorizeRoles('user', 'admin'), EventController_1.default.updateEvent);
        this.router.delete('/events/:id', auth_1.default.authenticateJWT, auth_1.default.authorizeRoles('user', 'admin'), EventController_1.default.deleteEvent);
    }
}
exports.default = new EventRouter().router;
