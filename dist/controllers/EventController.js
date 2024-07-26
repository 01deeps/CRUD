"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.EventController = void 0;
const routing_controllers_1 = require("routing-controllers");
const EventService_1 = __importDefault(require("../services/EventService"));
const auth_1 = __importDefault(require("../middleware/auth"));
let EventController = class EventController {
    createEvent(req, eventData, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('createEvent called');
            console.log('Request Body:', eventData);
            console.log('User ID:', req.user.id);
            try {
                const userId = req.user.id;
                const event = yield EventService_1.default.createEvent(eventData, userId);
                console.log('Event created:', event);
                return res.status(201).json(event);
            }
            catch (error) {
                console.log('Error creating event:', error);
                return res.status(500).json({ message: 'Failed to create event. Please check the request data and try again.' });
            }
        });
    }
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getEvents called');
            console.log('User Role:', req.user.role);
            try {
                const userRole = req.user.role;
                const events = yield EventService_1.default.getEvents(userRole);
                console.log('Events fetched:', events);
                return res.status(200).json(events);
            }
            catch (error) {
                console.log('Error fetching events:', error);
                const statusCode = error.message === 'Unauthorized access' ? 401 : 500;
                return res.status(statusCode).json({ message: error.message });
            }
        });
    }
    updateEvent(req, id, eventData, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('updateEvent called');
            console.log('Event ID:', id);
            console.log('Request Body:', eventData);
            console.log('User ID:', req.user.id);
            console.log('User Role:', req.user.role);
            try {
                const userId = req.user.id;
                const userRole = req.user.role;
                const result = yield EventService_1.default.updateEvent(id, eventData, userId, userRole);
                console.log('Event updated:', result);
                return res.status(200).json(result);
            }
            catch (error) {
                console.log('Error updating event:', error);
                const statusCode = error.message === 'Unauthorized access' ? 401 : 500;
                return res.status(statusCode).json({ message: error.message });
            }
        });
    }
    deleteEvent(req, id, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('deleteEvent called');
            console.log('Event ID:', id);
            console.log('User ID:', req.user.id);
            console.log('User Role:', req.user.role);
            try {
                const userId = req.user.id;
                const userRole = req.user.role;
                const result = yield EventService_1.default.deleteEvent(id, userId, userRole);
                console.log('Event deleted:', result);
                return res.status(200).json(result);
            }
            catch (error) {
                console.log('Error deleting event:', error);
                const statusCode = error.message === 'Unauthorized access' ? 401 : 500;
                return res.status(statusCode).json({ message: error.message });
            }
        });
    }
};
__decorate([
    (0, routing_controllers_1.Post)('/events'),
    (0, routing_controllers_1.UseBefore)(auth_1.default.authenticateJWT, auth_1.default.authorizeRoles('user', 'admin')),
    __param(0, (0, routing_controllers_1.Req)()),
    __param(1, (0, routing_controllers_1.Body)()),
    __param(2, (0, routing_controllers_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "createEvent", null);
__decorate([
    (0, routing_controllers_1.Get)('/events'),
    (0, routing_controllers_1.UseBefore)(auth_1.default.authenticateJWT, auth_1.default.authorizeRoles('admin')),
    __param(0, (0, routing_controllers_1.Req)()),
    __param(1, (0, routing_controllers_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getEvents", null);
__decorate([
    (0, routing_controllers_1.Put)('/events/:id'),
    (0, routing_controllers_1.UseBefore)(auth_1.default.authenticateJWT, auth_1.default.authorizeRoles('user', 'admin')),
    __param(0, (0, routing_controllers_1.Req)()),
    __param(1, (0, routing_controllers_1.Param)('id')),
    __param(2, (0, routing_controllers_1.Body)()),
    __param(3, (0, routing_controllers_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "updateEvent", null);
__decorate([
    (0, routing_controllers_1.Delete)('/events/:id'),
    (0, routing_controllers_1.UseBefore)(auth_1.default.authenticateJWT, auth_1.default.authorizeRoles('user', 'admin')),
    __param(0, (0, routing_controllers_1.Req)()),
    __param(1, (0, routing_controllers_1.Param)('id')),
    __param(2, (0, routing_controllers_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "deleteEvent", null);
EventController = __decorate([
    (0, routing_controllers_1.JsonController)()
], EventController);
exports.EventController = EventController;
