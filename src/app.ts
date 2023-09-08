import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoose from 'mongoose';
import morgan from 'morgan';
import config from './core/config';
import compression from './middleware/compression';
import favicon from './middleware/favicon';
import i18n from './middleware/i18n';
import routeNotFound from './middleware/routeNotFound';
import routes from './routes';

// Express instance
const app: Application = express();

if (process.env.NODE_ENV !== 'production') {
  app.enable('verbose errors');
  app.use(morgan('dev'));
}

// ------------
// Middleware |
// ------------

// favicon serve
app.use(favicon);

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// parse body params and attache them to req.body
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
// parse application/json
app.use(bodyParser.json({ limit: '30mb' }));

// Make sure the body is parsed beforehand.
app.use(hpp());

// Request Limit
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message:
      'Too many accounts created from this IP, please try again after an 15 minutes',
  })
);

// Compress all HTTP responses
app.use(compression);

// I18n Translation
app.use(i18n);

// Serve static Files
app.use(express.static('public'));

// Connect To DB
mongoose
  .connect(config.server.mongoUrl)
  .then(() => {
    if (config.isDevelopment) {
      console.log(`DB Connection: OK`);
    }

    app.listen(config.server.port, () => {
      console.log(`🚀 API Server listening on port:${config.server.port}`);

      if (config.isDevelopment) {
        console.info(`http://localhost:${config.server.port}/api/v1`);
      }

      // mount api routes
      app.use('/api/v1', routes);
      // 404 route not found
      app.use(routeNotFound);
    });
  })
  .catch((error: Error) => {
    console.log(`Error connecting to DB\n${error}`);
  });

module.exports = app; // for testing
