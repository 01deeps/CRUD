import { JsonController, Post, Get, Put, Delete, Param, Body, UseBefore, Req, Res } from 'routing-controllers';
import { Request, Response } from 'express';
import EventService from '../services/EventService';
import authMiddleware from '../middleware/auth';
import { Service } from 'typedi'; // Import Service decorator
import logger from '../config/logger'; // Import logger

@Service() // Register this controller as a service
@JsonController()
export class EventController {
  @Post('/events')
  @UseBefore(authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'))
  async createEvent(@Req() req: Request, @Body() eventData: any, @Res() res: Response) {
    logger.info('createEvent called');
    logger.info('Request Body:', eventData);
    logger.info('User ID:', req.user.id);

    try {
      const userId = req.user.id;
      const event = await EventService.createEvent(eventData, userId);
      logger.info('Event created:', event);
      return res.status(201).json(event);
    } catch (error) {
      logger.error('Error creating event:', error);
      return res.status(500).json({ message: 'Failed to create event. Please check the request data and try again.' });
    }
  }

  @Get('/events')
  @UseBefore(authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('admin'))
  async getEvents(@Req() req: Request, @Res() res: Response) {
    logger.info('getEvents called');
    logger.info('User Role:', req.user.role);

    try {
      const userRole = req.user.role;
      const events = await EventService.getEvents(userRole);
      logger.info('Events fetched:', events);
      return res.status(200).json(events);
    } catch (error) {
      logger.error('Error fetching events:', error);
      const statusCode = (error as Error).message === 'Unauthorized access' ? 401 : 500;
      return res.status(statusCode).json({ message: (error as Error).message });
    }
  }

  @Put('/events/:id')
  @UseBefore(authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'))
  async updateEvent(@Req() req: Request, @Param('id') id: string, @Body() eventData: any, @Res() res: Response) {
    logger.info('updateEvent called');
    logger.info('Event ID:', id);
    logger.info('Request Body:', eventData);
    logger.info('User ID:', req.user.id);
    logger.info('User Role:', req.user.role);

    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const result = await EventService.updateEvent(id, eventData, userId, userRole);
      logger.info('Event updated:', result);
      return res.status(200).json(result);
    } catch (error) {
      logger.error('Error updating event:', error);
      const statusCode = (error as Error).message === 'Unauthorized access' ? 401 : 500;
      return res.status(statusCode).json({ message: (error as Error).message });
    }
  }

  @Delete('/events/:id')
  @UseBefore(authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'))
  async deleteEvent(@Req() req: Request, @Param('id') id: string, @Res() res: Response) {
    logger.info('deleteEvent called');
    logger.info('Event ID:', id);
    logger.info('User ID:', req.user.id);
    logger.info('User Role:', req.user.role);

    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const result = await EventService.deleteEvent(id, userId, userRole);
      logger.info('Event deleted:', result);
      return res.status(200).json(result);
    } catch (error) {
      logger.error('Error deleting event:', error);
      const statusCode = (error as Error).message === 'Unauthorized access' ? 401 : 500;
      return res.status(statusCode).json({ message: (error as Error).message });
    }
  }
}

export default EventController;
