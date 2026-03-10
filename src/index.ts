import express from 'express';
import { setupApp } from './setup-app';
import { SETTINGS } from './core/settings/settings';
import { runDB } from './db/db';
import { createAdminIfNotExists } from './create-admin';

const app = express();
setupApp(app);

let isDbConnected = false;
let isShuttingDown = false;

async function ensureDbConnected() {
  if (!isDbConnected && !isShuttingDown) {
    try {
      console.log('📦 Connecting to database...');
      await runDB(SETTINGS.MONGO_URL);
      await createAdminIfNotExists();
      isDbConnected = true;
      console.log('✅ Database connected');
    } catch (error) {
      isDbConnected = false;
      throw error;
    }
  }
}

export default async function handler(req: any, res: any) {
  try {
    await ensureDbConnected();
    return app(req, res);
  } catch (error) {
    console.error('❌ Serverless error:', error);
    return res.status(500).json({
      errors: [
        {
          status: 500,
          detail: error instanceof Error ? error.message : 'Unknown error',
          source: { pointer: '/server' },
          code: 'INTERNAL_ERROR',
        },
      ],
    });
  }
}

if (require.main === module) {
  const startServer = async () => {
    try {
      await ensureDbConnected();

      const PORT = Number(process.env.PORT || SETTINGS.PORT);
      const HOST =
        process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

      const server = app.listen(PORT, HOST, () => {
        console.log(`🚀 Server running at http://${HOST}:${PORT}`);
        console.log(`📚 Swagger: http://localhost:${PORT}/api/swagger`);
      });

      // Graceful shutdown (только для локальной разработки)
      const shutdown = () => {
        if (isShuttingDown) return;
        isShuttingDown = true;

        console.log('🛑 Shutting down server...');
        server.close(() => {
          console.log('✅ Server stopped');
          process.exit(0);
        });
      };

      process.on('SIGINT', shutdown);
      process.on('SIGTERM', shutdown);
    } catch (error) {
      console.error('❌ Server failed to start:', error);
      process.exit(1);
    }
  };

  startServer();
}
