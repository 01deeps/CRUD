import express from 'express';
import bodyParser from 'body-parser';
import { database } from './config/database';
import eventRoutes from './routes/eventRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

database.connect().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

export default app;