import { JsonController, Post, Get, Put, Delete, Param, Body, UseBefore, Req, Res } from 'routing-controllers';
import { Request, Response } from 'express';
import EventService from '../services/EventService';
import authMiddleware from '../middleware/auth';

@JsonController()
export class EventController {
  @Post('/events')
  @UseBefore(authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'))
  async createEvent(@Req() req: Request, @Body() eventData: any, @Res() res: Response) {
    console.log('createEvent called');
    console.log('Request Body:', eventData);
    console.log('User ID:', req.user.id);

    try {
      const userId = req.user.id;
      const event = await EventService.createEvent(eventData, userId);
      console.log('Event created:', event);
      return res.status(201).json(event);
    } catch (error) {
      console.log('Error creating event:', error);
      return res.status(500).json({ message: 'Failed to create event. Please check the request data and try again.' });
    }
  }

  @Get('/events')
  @UseBefore(authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('admin'))
  async getEvents(@Req() req: Request, @Res() res: Response) {
    console.log('getEvents called');
    console.log('User Role:', req.user.role);

    try {
      const userRole = req.user.role;
      const events = await EventService.getEvents(userRole);
      console.log('Events fetched:', events);
      return res.status(200).json(events);
    } catch (error) {
      console.log('Error fetching events:', error);
      const statusCode = (error as Error).message === 'Unauthorized access' ? 401 : 500;
      return res.status(statusCode).json({ message: (error as Error).message });
    }
  }

  @Put('/events/:id')
  @UseBefore(authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'))
  async updateEvent(@Req() req: Request, @Param('id') id: string, @Body() eventData: any, @Res() res: Response) {
    console.log('updateEvent called');
    console.log('Event ID:', id);
    console.log('Request Body:', eventData);
    console.log('User ID:', req.user.id);
    console.log('User Role:', req.user.role);

    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const result = await EventService.updateEvent(id, eventData, userId, userRole);
      console.log('Event updated:', result);
      return res.status(200).json(result);
    } catch (error) {
      console.log('Error updating event:', error);
      const statusCode = (error as Error).message === 'Unauthorized access' ? 401 : 500;
      return res.status(statusCode).json({ message: (error as Error).message });
    }
  }

  @Delete('/events/:id')
  @UseBefore(authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'))
  async deleteEvent(@Req() req: Request, @Param('id') id: string, @Res() res: Response) {
    console.log('deleteEvent called');
    console.log('Event ID:', id);
    console.log('User ID:', req.user.id);
    console.log('User Role:', req.user.role);

    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const result = await EventService.deleteEvent(id, userId, userRole);
      console.log('Event deleted:', result);
      return res.status(200).json(result);
    } catch (error) {
      console.log('Error deleting event:', error);
      const statusCode = (error as Error).message === 'Unauthorized access' ? 401 : 500;
      return res.status(statusCode).json({ message: (error as Error).message });
    }
  }
}
