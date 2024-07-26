import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../config/logger';

// Define a custom type for req.user
interface CustomRequest extends Request {
  user?: { role: string; id: string };
}

class AuthMiddleware {
  public async authenticateJWT(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    console.log('authenticateJWT: Start');
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        console.log('authenticateJWT: Token found');
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log('authenticateJWT: Token verified', decoded);
        req.user = { role: decoded.role, id: decoded.id }; // Set req.user with the role and id
        next();
      } catch (error) {
        console.log('authenticateJWT: Invalid Token', error);
        logger.warn('Invalid Token');
        res.status(403).json({ error: 'Forbidden' }).end(); // Use end() to indicate no further processing
        return; // Ensure the function exits
      }
    } else {
      console.log('authenticateJWT: No Token Provided');
      logger.warn('No Token Provided');
      res.status(401).json({ error: 'Unauthorized' }).end(); // Use end() to indicate no further processing
      return; // Ensure the function exits
    }
  }

  public authorizeRoles(...roles: string[]) {
    return (req: CustomRequest, res: Response, next: NextFunction): void => {
      console.log('authorizeRoles: Start');
      console.log('authorizeRoles: Required roles', roles);
      console.log('authorizeRoles: User role', req.user?.role);

      if (!req.user || !roles.includes(req.user.role)) {
        console.log(`authorizeRoles: User role ${req.user?.role} not authorized`);
        logger.warn(`User role ${req.user?.role} not authorized`);
        res.status(403).json({ error: 'Unauthorized access' }).end(); // Use end() to indicate no further processing
        return; // Ensure the function exits
      }
      next();
    };
  }
}

export default new AuthMiddleware();
