const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Transactions API',
      version: '1.0.0',
      description: 'API documentation for managing product transactions',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Update with your server URL
        description: 'Local development server',
      },
    ],
  },
  apis: ['./app.js'], // Path to the main app file where routes are defined
};

const specs = swaggerJsdoc(swaggerOptions);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
