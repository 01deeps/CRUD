"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/eventRoutes.ts
const express_1 = require("express");
const EventController_1 = __importDefault(require("../controllers/EventController"));
const router = (0, express_1.Router)();
router.post('/events', EventController_1.default.createEvent);
router.get('/events', EventController_1.default.getEvents);
router.put('/events/:id', EventController_1.default.updateEvent);
router.delete('/events/:id', EventController_1.default.deleteEvent);
exports.default = router;
