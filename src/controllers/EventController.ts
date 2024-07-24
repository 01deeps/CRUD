// src/controllers/EventController.ts
import { Request, Response } from 'express';

class EventController {
  public createEvent = async (req: Request, res: Response): Promise<void> => {
    // Your implementation here
  };

  public getEvents = async (req: Request, res: Response): Promise<void> => {
    // Your implementation here
  };

  public updateEvent = async (req: Request, res: Response): Promise<void> => {
    // Your implementation here
  };

  public deleteEvent = async (req: Request, res: Response): Promise<void> => {
    // Your implementation here
  };
}

export default new EventController();
