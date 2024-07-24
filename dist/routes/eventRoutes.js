"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EventController_1 = __importDefault(require("../controllers/EventController"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
router.post('/events', auth_1.default.authenticateJWT, auth_1.default.authorizeRoles('user', 'admin'), (req, res, next) => {
    console.log('POST /events route hit');
    next();
}, EventController_1.default.createEvent);
router.get('/events', auth_1.default.authenticateJWT, auth_1.default.authorizeRoles('user', 'admin'), (req, res, next) => {
    console.log('GET /events route hit');
    next();
}, EventController_1.default.getEvents);
router.put('/events/:id', auth_1.default.authenticateJWT, auth_1.default.authorizeRoles('user', 'admin'), (req, res, next) => {
    console.log('PUT /events/:id route hit');
    next();
}, EventController_1.default.updateEvent);
router.delete('/events/:id', auth_1.default.authenticateJWT, auth_1.default.authorizeRoles('admin'), (req, res, next) => {
    console.log('DELETE /events/:id route hit');
    next();
}, EventController_1.default.deleteEvent);
exports.default = router;
