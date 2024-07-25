import { Request, Response, NextFunction } from 'express';

// Authentication Decorator
export function Authenticated(target: any, key: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
    try {
      // Authentication logic
      if (!req.headers.authorization) {
        return res.status(401).json({ error: 'No token provided' });
      }

      // Call the original method
      await originalMethod.apply(this, [req, res, next]);
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  return descriptor;
}

// Authorization Decorator
export function Authorized(roles: string[]) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      try {
        // Authorization logic
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
          return res.status(403).json({ error: 'Forbidden' });
        }

        // Call the original method
        await originalMethod.apply(this, [req, res, next]);
      } catch (error) {
        res.status(403).json({ error: 'Forbidden' });
      }
    };

    return descriptor;
  };
}
