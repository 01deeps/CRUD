import { Router, Request, Response, NextFunction } from 'express';
import EventController from '../controllers/EventController';
import authMiddleware from '../middleware/auth';

class EventRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/events', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'), 
      (req: Request, res: Response, next: NextFunction) => {
        console.log('POST /events route hit');
        next();
      }, 
      EventController.createEvent
    );

    this.router.get('/events', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'), 
      (req: Request, res: Response, next: NextFunction) => {
        console.log('GET /events route hit');
        next();
      }, 
      EventController.getEvents
    );

    this.router.put('/events/:id', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'), 
      (req: Request, res: Response, next: NextFunction) => {
        console.log('PUT /events/:id route hit');
        next();
      }, 
      EventController.updateEvent
    );

    this.router.delete('/events/:id', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'), 
      (req: Request, res: Response, next: NextFunction) => {
        console.log('DELETE /events/:id route hit');
        next();
      }, 
      EventController.deleteEvent
    );
  }
}

export default new EventRouter().router;
