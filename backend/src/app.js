const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const jobsRouter = require('./routes/jobs.routes');
const authRouter = require('./routes/auth.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const openapiSpec = require('./docs/openapi');

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['https://react.localhost', 'https://react-dev.localhost'],
  credentials: true,
}));
app.use(cookieParser());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.get('/', (request, response) => {
  response.json({ ok: true, service: 'node', path: request.path });
});

app.get('/health', (request, response) => {
  response.json({ ok: true });
});

app.use('/jobs', jobsRouter);
app.use('/auth', authRouter);
app.use(errorMiddleware);

module.exports = app;
