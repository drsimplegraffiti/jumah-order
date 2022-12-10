import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './database/database';
import productRouter from './routes/product';
import userRouter from './routes/user';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler, notFound } from './errors/errors-handler';

dotenv.config();

const app = express();


// connect to database
connectDatabase();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());


// Home page
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello World!' });
});

// Mount routers
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
    


// Handle 404 errors
app.use(notFound);

// Handle errors
app.use(errorHandler);


export default app;



