// import { Router, Request, Response, NextFunction } from 'express';
// import {EventController } from '../controllers/EventController';
// import authMiddleware from '../middleware/auth';

// class EventRouter {
//   public router: Router;

//   constructor() {
//     this.router = Router();
//     this.initializeRoutes();
//   }

//   private initializeRoutes() {
//     this.router.post('/events', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'),EventController.createEvent);

//     this.router.get('/events', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('admin'), EventController.getEvents);

//     this.router.put('/events/:id', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'), EventController.updateEvent);

//     this.router.delete('/events/:id', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'), EventController.deleteEvent);
//   }
// }

// export default new EventRouter().router;

