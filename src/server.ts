import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { database } from './config/database';
import eventRoutes from './routes/eventRoutes';
import userRoutes from './routes/userRoutes';

class Server {
  private app: express.Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    this.app.use(bodyParser.json());
  }

  private configureRoutes(): void {
    this.app.use('/api/work', eventRoutes);
    this.app.use('/api', userRoutes);
  }

  private configureErrorHandling(): void {
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error('Internal Server Error:', err.stack);
      res.status(500).send('Internal Server Error');
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
