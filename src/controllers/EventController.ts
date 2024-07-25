import { JsonController, Post, Get, Put, Delete, Param, Body, UseBefore, Req } from 'routing-controllers';
import { Request } from 'express';
import EventService from '../services/EventService';
import authMiddleware from '../middleware/auth';

@JsonController()
export class EventController {
  @Post('/events')
  @UseBefore(authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'))
  async createEvent(@Req() req: Request, @Body() eventData: any) {
    console.log('createEvent called');
    console.log('Request Body:', eventData);
    console.log('User ID:', req.user.id);

    try {
      const userId = req.user.id;  // Ensure this is being set correctly
      const event = await EventService.createEvent(eventData, userId);
      console.log('Event created:', event);
      return event;
    } catch (error) {
      console.log('Error creating event:', error);
      throw new Error('Failed to create event. Please check the request data and try again.');
    }
  }

  @Get('/events')
  @UseBefore(authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('admin'))
  async getEvents(@Req() req: Request) {
    console.log('getEvents called');
    console.log('User Role:', req.user.role);

    try {
      const userRole = req.user.role;  // Ensure this is being set correctly
      const events = await EventService.getEvents(userRole);
      console.log('Events fetched:', events);
      return events;
    } catch (error) {
      console.log('Error fetching events:', error);
      throw new Error('Failed to fetch events. Please try again later.');
    }
  }

  @Put('/events/:id')
  @UseBefore(authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'))
  async updateEvent(@Req() req: Request, @Param('id') id: string, @Body() eventData: any) {
    console.log('updateEvent called');
    console.log('Event ID:', id);
    console.log('Request Body:', eventData);
    console.log('User ID:', req.user.id);
    console.log('User Role:', req.user.role);

    try {
      const userId = req.user.id;  // Ensure this is being set correctly
      const userRole = req.user.role;  // Ensure this is being set correctly
      const result = await EventService.updateEvent(id, eventData, userId, userRole);
      console.log('Event updated:', result);
      return result;
    } catch (error) {
      console.log('Error updating event:', error);
      throw new Error('Failed to update event. Please check the request data and try again.');
    }
  }

  @Delete('/events/:id')
  @UseBefore(authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin'))
  async deleteEvent(@Req() req: Request, @Param('id') id: string) {
    console.log('deleteEvent called');
    console.log('Event ID:', id);
    console.log('User ID:', req.user.id);
    console.log('User Role:', req.user.role);

    try {
      const userId = req.user.id;  // Ensure this is being set correctly
      const userRole = req.user.role;  // Ensure this is being set correctly
      const result = await EventService.deleteEvent(id, userId, userRole);
      console.log('Event deleted:', result);
      return result;
    } catch (error) {
      console.log('Error deleting event:', error);
      throw new Error('Failed to delete event. Please try again later.');
    }
  }
}
