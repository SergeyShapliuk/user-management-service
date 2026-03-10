import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test API',
      version: '1.0.0',
      description:
        'For admin login - email: admin@mail.com, password: admin123',
    },
  },
  apis: [
    path.join(__dirname, "../../auth/docs/*.swagger.yml"),
    path.join(__dirname, "../../users/docs/*.swagger.yml"),
    path.join(__dirname, "../../testing/docs/*.swagger.yml"),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
