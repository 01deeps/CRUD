import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../config/logger';

class AuthMiddleware {
  public async authenticateJWT(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log('authenticateJWT: Start');
    const token = req.headers.authorization?.split(' ')[1];
  
    if (token) {
      try {
        console.log('authenticateJWT: Token found');
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log('authenticateJWT: Token verified', decoded);
        req.user = decoded; // Ensure `req.user` is set correctly
        next();
      } catch (error) {
        console.log('authenticateJWT: Invalid Token', error);
        logger.warn('Invalid Token');
        res.status(403).json({ error: 'Forbidden' });
      }
    } else {
      console.log('authenticateJWT: No Token Provided');
      logger.warn('No Token Provided');
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
  
  public authorizeRoles(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      console.log('authorizeRoles: Start');
      console.log('authorizeRoles: Required roles', roles);
      console.log('authorizeRoles: User role', req.user.role);
      if (!roles.includes(req.user.role)) {
        console.log(`authorizeRoles: User role ${req.user.role} not authorized`);
        logger.warn(`User role ${req.user.role} not authorized`);
        res.status(403).json({ error: 'Unauthorized access' });
      } else {
        console.log(`authorizeRoles: User role ${req.user.role} authorized`);
        next();
      }
    };
  }
}

const authMiddleware = new AuthMiddleware();
export default authMiddleware;
