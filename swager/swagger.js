const swaggerAutogen = require('swagger-autogen')({
  openapi: '3.0.0',
});

const doc = {
  info: {
    title: 'My API',
    description: 'API documentation',
  },
  host: 'localhost:5000',
  schemes: ['http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['../index.js']; // путь к файлу, который запускает ваше приложение

swaggerAutogen(outputFile, endpointsFiles, doc);
