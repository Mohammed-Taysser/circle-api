import 'dotenv/config';
import Joi from 'joi';

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...['development', 'production', 'test', 'provision'])
    .required(),
  PORT: Joi.number().required(),
  MONGO_URL: Joi.string().required(),

  JWT_SECRET_KEY: Joi.string().required(),
  JWT_REFRESH_KEY: Joi.string().required(),
  JWT_LIFE_TIME: Joi.string().required(),

  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),

  LOGGER_ENABLED: Joi.boolean()
    .truthy('TRUE')
    .truthy('true')
    .falsy('FALSE')
    .falsy('false')
    .default(true),
})
  .unknown()
  .required();

const { error, value: envVars } = schema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const CONFIG = {
  env: envVars.NODE_ENV,
  isTest: envVars.NODE_ENV === 'test',
  isDevelopment: envVars.NODE_ENV === 'development',

  logger: {
    enabled: envVars.LOGGER_ENABLED,
  },

  server: {
    port: envVars.PORT,
    mongoUrl: envVars.MONGO_URL,
  },

  JWT_SECRET_KEY: envVars.JWT_SECRET_KEY,
  JWT_REFRESH_KEY: envVars.JWT_REFRESH_KEY,
  JWT_LIFE_TIME: envVars.JWT_LIFE_TIME,

  CLOUDINARY_CLOUD_NAME: envVars.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: envVars.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: envVars.CLOUDINARY_API_SECRET,
};

export default CONFIG;
