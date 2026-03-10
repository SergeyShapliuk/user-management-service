import express from 'express';
import { setupApp } from './setup-app';
import { SETTINGS } from './core/settings/settings';
import { runDB } from './db/db';
import { createAdminIfNotExists } from './create-admin';

let isInitialized = false;

export const initApp = async (): Promise<express.Application> => {
  if (isInitialized) {
    throw new Error('App already initialized');
  }

  const app = express();

  setupApp(app);

  try {
    console.log('🔄 Connecting to database...');
    await runDB(SETTINGS.MONGO_URL);
    console.log('✅ Database connected');

    await createAdminIfNotExists();

    isInitialized = true;
    return app;
  } catch (error) {
    console.error('❌ App initialization failed:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  const app = await initApp();

  const PORT = Number(process.env.PORT || SETTINGS.PORT);
  const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

  const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running at http://${HOST}:${PORT}`);
  });

  const shutdown = () => {
    console.log('🛑 Shutting down server...');
    server.close(() => {
      console.log('✅ Server stopped');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

if (require.main === module) {
  startServer().catch((err) => {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  });
}
