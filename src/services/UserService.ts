import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import logger from '../config/logger';
import { Request, Response } from 'express';

class UserService {
  public async register(req: Request, res: Response, body: any): Promise<any> {
    try {
      const { username, password, role } = body;

      // Check if the username already exists
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        throw new Error('Username already exists');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create a new user
      const user = await User.create({ username, password: hashedPassword, role });

      // Return the user
      return user;
    } catch (error: any) {
      logger.error(`Error registering user: ${error.message || error}`);

      // Handle unique constraint error
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ message: 'Username already exists' });
      } else {
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }
      throw error;
    }
  }

  public async login(req: Request, res: Response, body: any): Promise<void> {
    try {
      const { username, password } = body;
      const user = await User.findOne({ where: { username } });

      if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET as string,
          { expiresIn: '1h' }
        );
        if (!res.headersSent) {
          res.status(200).json({ token });
        }
        logger.info(`User logged in: ${username}`);
      } else {
        if (!res.headersSent) {
          res.status(401).json({ error: 'Invalid credentials' });
        }
        logger.warn(`Invalid login attempt: ${username}`);
      }
    } catch (error: any) {
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
      logger.error(`Error logging in user: ${error.message || error}`);
    }
  }
}

export default new UserService();
