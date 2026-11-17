import path from 'node:path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { app } from './server/app.js';

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  app.use(express.static('public'));
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => res.sendFile(path.resolve('dist/index.html')));
  } else {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  }
  app.listen(port, '0.0.0.0', () => console.log(`Server listening on http://0.0.0.0:${port}`));
}
startServer();
