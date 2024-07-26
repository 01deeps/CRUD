import Event from '../models/Event';

class EventService {
  public createEvent = async (eventData: any, userId: number): Promise<any> => {
    console.log('createEvent called');
    console.log('Request Body:', eventData);
  
    try {
      if (!eventData) {
        throw new Error('Request body is missing');
      }
  
      const { event_name, date, description } = eventData;
  
      if (!event_name || !date || !description) {
        throw new Error('Missing required fields');
      }
  
      const event = await Event.create({ event_name, date, description, userId });
      console.log('Event created:', event);
  
      // Return only relevant data
      return {
        id: event.id,
        event_name: event.event_name,
        date: event.date,
        description: event.description,
        userId: event.userId,
      };
    } catch (error) {
      console.log('Error creating event:', error);
      throw new Error('Internal Server Error');
    }
  };

  public getEvents = async (userRole: string): Promise<any[]> => {
    console.log('getEvents called');

    try {
      if (userRole !== 'admin') {
        throw new Error('Unauthorized access');
      }

      const events = await Event.findAll();
      console.log('Events fetched:', events);

      // Return only relevant data
      return events.map(event => ({
        id: event.id,
        event_name: event.event_name,
        date: event.date,
        description: event.description,
        userId: event.userId,
      }));
    } catch (error) {
      console.log('Error fetching events:', error);
      if ((error as Error).message === 'Unauthorized access') {
        throw new Error((error as Error).message);
      } else {
        throw new Error('Internal Server Error');
      }
    }
  };

  public updateEvent = async (id: string, eventData: any, userId: number, userRole: string): Promise<any> => {
    console.log('updateEvent called');
    console.log('Request Params:', { id });
    console.log('Request Body:', eventData);
  
    try {
      const { event_name, date, description } = eventData;
  
      // if (!event_name || !date || !description) {
      //   throw new Error('Missing required fields');
      // }
  
      const event = await Event.findByPk(id);
  
      if (event && (event.userId === userId || userRole === 'admin')) {
        event.event_name = event_name;
        event.date = date;
        event.description = description;
        await event.save();
        console.log('Event updated:', event);
  
        // Return only relevant data
        return {
          message: 'Event updated',
          id: event.id,
          event_name: event.event_name,
          date: event.date,
          description: event.description,
          userId: event.userId,
        };
      } else {
        throw new Error('Unauthorized access');
      }
    } catch (error) {
      console.log('Error updating event:', error);
      if ((error as Error).message === 'Unauthorized access') {
        throw new Error((error as Error).message);
      } else {
        throw new Error('Missing required fields');
      }
    }
  };

  public deleteEvent = async (id: string, userId: number, userRole: string): Promise<any> => {
    console.log('deleteEvent called');
    console.log('Request Params:', { id });
  
    try {
      const event = await Event.findByPk(id);
  
      if (event && (event.userId === userId || userRole === 'admin')) {
        await event.destroy();
        console.log('Event deleted:', id);
  
        // Return only relevant data
        return {
          message: 'Event deleted',
          id,
        };
      } else {
        throw new Error('Unauthorized access');
      }
    } catch (error) {
      console.log('Error deleting event:', error);
      if ((error as Error).message === 'Unauthorized access') {
        throw new Error((error as Error).message);
      } else {
        throw new Error('Internal Server Error');
      }
    }
  };
}

export default new EventService();
