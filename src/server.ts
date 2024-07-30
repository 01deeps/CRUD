import express, { Request, Response, NextFunction } from 'express';
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { database } from './config/database';
import authMiddleware from './middleware/auth';
import path from 'path';
import fs from 'fs';
import logger from './config/logger';
import 'reflect-metadata';

// Use typedi container
useContainer(Container);

class Server {
  private app: express.Application;
  private port: number;

  constructor(port: number) {
    this.port = port;

    // Dynamically load controllers
    const controllers = this.loadControllers(path.join(__dirname, 'controllers'));

    this.app = createExpressServer({
      controllers: controllers,
      middlewares: [authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin')],
      defaultErrorHandler: true, // Enable default error handler
    });

    this.configureMiddleware();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    this.app.use(express.json()); // Ensure this is before any routes
  }

  private configureErrorHandling(): void {
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      logger.error(`Internal Server Error: ${err.stack}`);
      if (!res.headersSent) {
        res.status(500).send('Internal Server Error');
      }
    });
  }

  private loadControllers(controllersPath: string): any[] {
    const controllers: any[] = [];
    fs.readdirSync(controllersPath).forEach(file => {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const controller = require(path.join(controllersPath, file)).default || require(path.join(controllersPath, file));
        if (controller) {
          controllers.push(controller);
        }
      }
    });
    return controllers;
  }

  public async start(): Promise<void> {
    try {
      await database.connect();
      this.app.listen(this.port, () => {
        logger.info(`Server is running on http://localhost:${this.port}`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
    }
  }
}

const server = new Server(3000);
server.start();

export default server;
