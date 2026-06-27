import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.routes';
import booksRouter from './routes/books.routes';
import loansRouter from './routes/loans.routes';
import reportsRouter from './routes/reports.routes';

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL ?? '',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
}));

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/books', booksRouter);
app.use('/api/loans', loansRouter);
app.use('/api/reports', reportsRouter);

export default app;
