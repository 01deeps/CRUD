import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import logger from '../config/logger';

class UserService {
  public async register(body: any): Promise<any> {
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
      throw error;
    }
  }

  public async login(body: any): Promise<{ token: string }> {
    try {
      const { username, password } = body;
      const user = await User.findOne({ where: { username } });

      if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET as string,
          { expiresIn: '1h' }
        );
        logger.info(`User logged in: ${username}`);
        return { token };
      } else {
        logger.warn(`Invalid login attempt: ${username}`);
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      logger.error(`Error logging in user: ${error.message || error}`);
      throw error;
    }
  }
}

export default new UserService();
