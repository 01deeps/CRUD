"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/eventRoutes.ts
const express_1 = require("express");
const EventController_1 = __importDefault(require("../controllers/EventController"));
// Create a new router instance
const router = (0, express_1.Router)();
// Define the route for creating a new event
router.post('/events', EventController_1.default.createEvent);
// Define the route for fetching all events
router.get('/events', EventController_1.default.getEvents);
// Define the route for updating an event by its ID
router.put('/events/:id', EventController_1.default.updateEvent);
// Define the route for deleting an event by its ID
router.delete('/events/:id', EventController_1.default.deleteEvent);
// Export the router to be used in the main application
exports.default = router;
