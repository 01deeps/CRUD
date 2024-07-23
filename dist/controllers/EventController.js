"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/controllers/EventController.ts
const EventService_1 = __importDefault(require("../services/EventService"));
class EventController {
    constructor() {
        this.createEvent = EventService_1.default.createEvent;
        this.getEvents = EventService_1.default.getEvents;
        this.updateEvent = EventService_1.default.updateEvent;
        this.deleteEvent = EventService_1.default.deleteEvent;
    }
}
exports.default = new EventController();
