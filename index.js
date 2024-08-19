require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const v1Router = require('./router/v1');
const errorMiddleware = require('./middlewares/error-middleware');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swager/swagger.json');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    })
);
app.use(helmet());

app.use('/api/v1', v1Router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        app.listen(PORT, () =>
            console.log(`Server started on PORT = ${PORT}`)
        );
    } catch (e) {
        console.log(e);
    }
};

start();

module.exports = app;
