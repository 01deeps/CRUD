"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = (0, express_1.Router)();
// Apply the middleware to the routes
router.post('/register', UserController_1.default.register);
router.post('/login', UserController_1.default.login);
// router.get('/users', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('admin'), UserController.getUsers);
// router.delete('/users/:id', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('admin'), UserController.deleteUser);
exports.default = router;
