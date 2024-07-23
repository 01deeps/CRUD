// src/server.ts
import express from 'express';
import bodyParser from 'body-parser';
import { database } from './config/database';
import eventRoutes from './routes/eventRoutes';

const app = express();
const port = 3000;

app.use(bodyParser.json());
// Setting up routes for endpoints
app.use('/api', eventRoutes);

// Add error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Connect to the database and start the server
database.connect().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
