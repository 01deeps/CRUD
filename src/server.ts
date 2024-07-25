import express, { Request, Response, NextFunction } from 'express';
import { createExpressServer } from 'routing-controllers';
import { database } from './config/database';
import { EventController } from './controllers/EventController';
import { UserController } from './controllers/UserController';
import authMiddleware from './middleware/auth';

import 'reflect-metadata';

class Server {
  private app: express.Application;
  private port: number;

  constructor(port: number) {
    this.port = port;

    this.app = createExpressServer({
      controllers: [EventController, UserController],
      middlewares: [authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin')],
      defaultErrorHandler: false,
    });

    this.configureMiddleware();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    this.app.use(express.json()); // Ensure this is before any routes
  }
  private configureErrorHandling(): void {
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error('Internal Server Error:', err.stack);
      if (!res.headersSent) {
        res.status(500).send('Internal Server Error');
      }
    });
  }

  public async start(): Promise<void> {
    await database.connect();
    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}

const server = new Server(3000);
server.start();

export default server;
