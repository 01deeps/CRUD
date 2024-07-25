import EventService from '../services/EventService';

class EventController {
  public createEvent = EventService.createEvent;
  public getEvents = EventService.getEvents;
  public updateEvent = EventService.updateEvent;
  public deleteEvent = EventService.deleteEvent;
}

export default new EventController();
