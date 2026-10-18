import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './src/server/routes';
import { seedDemoDataIfEmpty } from './src/server/seed';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.DEFAULT_APP_PORT || 3000);

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));

  // Mount API routes
  app.use('/api', apiRouter);

  // Auto-seed demo data if empty on startup so store is immediately ready
  try {
    await seedDemoDataIfEmpty();
  } catch (err) {
    console.warn('Initial seed check error:', err);
  }

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`PyNotes full-stack server running on port ${PORT}`);
  });
}

startServer();
