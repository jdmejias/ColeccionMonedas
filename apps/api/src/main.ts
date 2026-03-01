import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    // Allow requests from any localhost origin during development
    origin: (origin, callback) => {
      // allow requests with no origin (like curl or server-to-server)
      if (!origin) return callback(null, true);
      // Accept any http://localhost:<port>
      try {
        const url = new URL(origin);
        if (url.hostname === 'localhost') return callback(null, true);
      } catch (e) {
        // ignore parse errors
      }
      // Fallback: reject other origins
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`API running on http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
