import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import AuthRouter from './routes/auth.route';
import UserRoute from './routes/user.route';
import CaseRoute from './routes/case.route';
import connectDB from './DBConfig/DBConnect';
import { errorHandler } from './middleware/errorHandler';
import cron from 'node-cron';

const app = express();

connectDB;

const port = process.env.PORT || 3300;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '',
    credentials: true,
  })
);

app.use(helmet());
// cron.schedule('* * * * *', async () => {
//   console.log('API is running');
//   try {
//     // const response = await fetch('https://upopp-backend.onrender.com');
//     const response = await fetch(
//       'https://upopp-backend-testing.onrender.com/business/paid-campaigns/all'
//     );

//     if (response.ok) {
//       const data = await response.json();
//       console.log(`Backend API call successful:`);
//       console.log(data.message);
//     } else {
//       console.error(`Unexpected status code`);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

app.use('/api/auth', AuthRouter);
app.use('/api/users', UserRoute);
app.use('/api/cases', CaseRoute);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
