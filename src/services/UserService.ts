import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import logger from '../config/logger';

class UserService {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, password: hashedPassword, role });

      res.status(201).json(user);
      logger.info(`User registered: ${username}`);
    } catch (error: any) {
      res.status(500).json({ error: 'Internal Server Error' });
      logger.error(`Error registering user: ${error.message || error}`);
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });

      if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET as string,
          { expiresIn: '1h' }
        );
        res.status(200).json({ token });
        logger.info(`User logged in: ${username}`);
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
        logger.warn(`Invalid login attempt: ${username}`);
      }
    } catch (error: any) {
      res.status(500).json({ error: 'Internal Server Error' });
      logger.error(`Error logging in user: ${error.message || error}`);
    }
  }
}

export default new UserService();
