import { createClient } from 'redis';
import session, { SessionOptions } from 'express-session';
import connectRedis from 'connect-redis';
import { CookieOptions } from 'express';

export const redisSessionMiddleware = async (
  isProduction: boolean,
  sessionSecret: string
): Promise<SessionOptions> => {
  try {
    const RedisStore = connectRedis(session);
    const redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'redis://redis',
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
      },
      legacyMode: true,
    });

    await redisClient.connect();

    redisClient.on('error', function (err) {
      console.log('Could not establish a connection with redis. ' + err);
    });
    redisClient.on('connect', function (err) {
      console.log('Connected to redis successfully');
    });
    const settings: SessionOptions = {
      store: new RedisStore({ client: redisClient as any }),
      secret: sessionSecret,
      resave: true,
      saveUninitialized: true,
    };
    const cookie: CookieOptions = {
      // if true only transmit cookie over https
      secure: isProduction,
      // if true prevent client side JS from reading the cookie
      httpOnly: isProduction,
      // session max age in miliseconds
      maxAge: 1000 * 60 * 10,
    };
    Object.assign(settings, cookie);
    return settings;
  } catch (error: any) {
    throw new Error(error);
  }
};
