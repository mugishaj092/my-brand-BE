import express from 'express';
import morgan from 'morgan';
import userRouter from './src/routes/useRouter';
import BlogRouter from './src/routes/blogsRoute';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/blog', BlogRouter);

export default app;
