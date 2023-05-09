import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import helmet from 'helmet';
import * as compression from 'compression';
import * as session from 'express-session';
import * as passport from 'passport';
import { ErrorHandler } from './handler/error.handler';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // MIDDLEWARE
  app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
  app.use(compression());
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new ErrorHandler());
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000,
        secure: false,
      },
    }),
  );
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
