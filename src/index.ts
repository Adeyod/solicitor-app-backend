import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import AuthRouter from './routes/auth.route';
import UserRoute from './routes/user.route';
import CaseRoute from './routes/case.route';
import connectDB from './DBConfig/DBConnect';
import { errorHandler } from './middleware/errorHandler';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';

const app = express();

connectDB;

const port = process.env.PORT || 3300;

const allowedOrigins: string[] = [
  process.env.FRONTEND_URL || '',
  'https://solicitor-app-frontend.onrender.com',
];

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Access Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(helmet());

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the server side of the XYX solicitor application',
    status: 200,
    success: true,
  });
});

console.log('Checking templates folder...');
const templatesPath = path.join(__dirname, 'utils', 'templates');
const templatesUrl = path.join(
  __dirname,
  'utils',
  'templates',
  'emailTemplate.ejs'
);
console.log('templatesPath found:', templatesPath);
console.log('templatesUrl found:', templatesUrl);
try {
  const templateFiles = fs.readdirSync(templatesPath);

  console.log('Templates found:', templateFiles);
} catch (err) {
  console.error('Error reading templates folder:', err);
}

cron.schedule('*/30 * * * *', async () => {
  console.log('API is running');
  try {
    const response = await fetch('https://solicitor-app-backend.onrender.com');

    console.log(response);

    if (response.ok) {
      const data = await response.json();
      console.log(`Backend API call successful:`);
      console.log(data.message);
    } else {
      console.error(`Unexpected status code`);
    }
  } catch (error) {
    console.log(error);
  }
});

app.use('/api/auth', AuthRouter);
app.use('/api/users', UserRoute);
app.use('/api/cases', CaseRoute);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
