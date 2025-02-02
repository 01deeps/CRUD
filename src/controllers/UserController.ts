import { JsonController, Post, Body, Req, Res } from 'routing-controllers';
import { Request, Response } from 'express';
import UserService from '../services/UserService';
import logger from '../config/logger';
import { Service } from 'typedi';

@Service()
@JsonController()
export class UserController {
  @Post('/register')
  async register(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    try {
      logger.info('Registering user');
      const user = await UserService.register(body);
      logger.info('User registered successfully', user);
      return res.status(201).json(user);
    } catch (error) {
      logger.error('Error registering user', error);
      return res.status(500).json({ message: 'Error registering user. Please try again later.' });
    }
  }

  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    try {
      logger.info('User login attempt');
      const { token } = await UserService.login(body);
      logger.info('User logged in successfully');
      return res.status(200).json({ token });
    } catch (error) {
      logger.warn('Invalid login attempt', error);
      return res.status(401).json({ message: 'Invalid credentials. Please check your username and password.' });
    }
  }
}

export default UserController;
