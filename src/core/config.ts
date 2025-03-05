import 'dotenv/config';
import Joi from 'joi';
import { Configuration } from 'types/app';

const durationRegex = /^\d+[smhd]$/; // Example: 10s, 30m, 1h, 7d

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...['development', 'production', 'test'])
    .required(),
  PORT: Joi.number().required().description('API Port'),
  MONGO_URL_DEV: Joi.string()
    .required()
    .description('Mongo DB url for development'),
  MONGO_URL_PROD: Joi.string()
    .required()
    .description('Mongo DB url for production'),

  JWT_SECRET_KEY: Joi.string().required().description('JWT secret key'),
  JWT_REFRESH_KEY: Joi.string()
    .required()
    .description('JWT refresh secret key'),
  JWT_LIFE_TIME: Joi.string()
    .pattern(durationRegex)
    .required()
    .description('JWT expiration time (e.g., 10s, 30m, 1h, 7d)'),
})
  .unknown()
  .required();

const { error, value: envVars } = schema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const CONFIG: Configuration = {
  env: envVars.NODE_ENV,

  server: {
    port: envVars.PORT,
    mongoUrl:
      envVars.NODE_ENV === 'development'
        ? envVars.MONGO_URL_DEV
        : envVars.MONGO_URL_PROD,
  },

  jwt: {
    secret: envVars.JWT_SECRET_KEY,
    refresh: envVars.JWT_REFRESH_KEY,
    life: envVars.JWT_LIFE_TIME,
  },
};

export default CONFIG;
