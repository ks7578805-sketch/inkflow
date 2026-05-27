import { createInkflowApp } from './bootstrap';

async function bootstrap() {
  const app = await createInkflowApp();
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
}

bootstrap();
