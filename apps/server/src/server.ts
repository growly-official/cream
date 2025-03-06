import 'reflect-metadata';
import express, { Express } from 'express';
import { sonicRoutes } from './routes';
import cors from 'cors';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

global.fetch = fetch as any;

async function bootstrap() {
  const port = process.env.SERVER_PORT || 3000;
  const app: Express = express();
  const isProduction = app.get('env') === 'production';

  if (isProduction) {
    app.use('/', express.static('ui'));
    app.set('trust proxy', 1);
  }

  app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
  });

  const corsOrigin = {
    origin: process.env.APP_URL || '*',
    credentials: true,
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOrigin));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use('/api/sonic', sonicRoutes());

  app.listen(port, () => {
    console.log(`[${isProduction ? 'Production' : 'Development'}] Server starts on port: ${port}`);
  });
}

bootstrap();
