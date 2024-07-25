import { JsonController, Post, Body, Req, Res } from 'routing-controllers';
import { Request, Response } from 'express';
import UserService from '../services/UserService';
import logger from '../config/logger';

@JsonController()
export class UserController {
  @Post('/register')
  async register(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    try {
      logger.info('Registering user');
      const user = await UserService.register(req, res, body);
      logger.info('User registered successfully', user);
      if (!res.headersSent) {
        res.status(201).json(user);
      }
    } catch (error) {
      logger.error('Error registering user', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error registering user. Please try again later.' });
      }
    }
  }

  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    try {
      logger.info('User login attempt');
      await UserService.login(req, res, body);
      logger.info('User logged in successfully');
    } catch (error) {
      logger.warn('Invalid login attempt', error);
      if (!res.headersSent) {
        res.status(401).json({ message: 'Invalid credentials. Please check your username and password.' });
      }
    }
  }
}
