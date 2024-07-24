"use strict";
// // src/middleware/authMiddleware.ts
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key'; // Fallback key
// const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.sendStatus(401);
//   const token = authHeader.split(' ')[1];
//   jwt.verify(token, SECRET_KEY, (err, user) => {
//     if (err) return res.sendStatus(403);
//     (req as any).user = user;
//     next();
//   });
// };
// export default authenticateToken;
