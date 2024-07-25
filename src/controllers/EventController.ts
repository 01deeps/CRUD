import { Request, Response } from 'express';
import Event from '../models/Event'; // Import your Event model

class EventController {
  public createEvent = async (req: Request, res: Response): Promise<void> => {
    console.log('createEvent called');
    console.log('Request Body:', req.body);

    try {
      const { event_name, date, description } = req.body;
      const event = await Event.create({ event_name, date, description, userId: req.user.id }); // Assume req.user.id is set by auth middleware
      console.log('Event created:', event);
      res.status(201).json(event); // Send the event details in the response
    } catch (error) {
      console.log('Error creating event:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  public getEvents = async (req: Request, res: Response): Promise<void> => {
    console.log('getEvents called');
    try {
      const events = await Event.findAll();
      console.log('Events fetched:', events);
      res.status(200).json(events); // Send the list of events in the response
    } catch (error) {
      console.log('Error fetching events:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  public updateEvent = async (req: Request, res: Response): Promise<void> => {
    console.log('updateEvent called');
    console.log('Request Body:', req.body);

    try {
      const { id } = req.params;
      const { event_name, date, description } = req.body;
      const event = await Event.findByPk(id);

      if (event && (event.userId === req.user.id || req.user.role === 'admin')) {
        event.event_name = event_name;
        event.date = date;
        event.description = description;
        await event.save();
        console.log('Event updated:', event);
        res.status(200).json({message : 'Updated event', id}); // Send the updated event details in the response
      } else {
        console.log('Event not found or unauthorized access');
        res.status(404).json({ error: 'Event not found or unauthorized access' });
      }
    } catch (error) {
      console.log('Error updating event:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  public deleteEvent = async (req: Request, res: Response): Promise<void> => {
    console.log('deleteEvent called');
    console.log('Request Params:', req.params);

    try {
      const { id } = req.params;
      const event = await Event.findByPk(id);

      if (event && (event.userId === req.user.id || req.user.role === 'admin')) {
        await event.destroy();
        console.log('Event deleted:', id);
        res.status(200).json({ message: 'Event deleted', id }); // Send event ID in response for confirmation
      } else {
        console.log('Event not found or unauthorized access');
        res.status(404).json({ error: 'Unauthorized access' });
      }
    } catch (error) {
      console.log('Error deleting event:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export default new EventController();
