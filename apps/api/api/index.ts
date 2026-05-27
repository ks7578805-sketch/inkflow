import express = require('express');
import { createInkflowApp } from '../src/bootstrap';

let cachedHandler: express.Express | null = null;

async function getHandler() {
  if (cachedHandler) {
    return cachedHandler;
  }

  const server = express();
  await createInkflowApp(server);
  cachedHandler = server;
  return cachedHandler;
}

export default async function handler(req: any, res: any) {
  const server = await getHandler();
  return server(req, res);
}
