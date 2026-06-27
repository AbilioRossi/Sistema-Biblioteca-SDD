import express from 'express';
import usersRouter from './routes/users.routes';
import booksRouter from './routes/books.routes';
import loansRouter from './routes/loans.routes';

const app = express();

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/books', booksRouter);
app.use('/api/loans', loansRouter);

export default app;
