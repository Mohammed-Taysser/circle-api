import 'dotenv/config';
import { StringValue } from 'ms';
import { Configuration } from 'types/app';
import z from 'zod';

// Regex for validating JWT duration (e.g., 10s, 30m, 1h, 7d)
const durationRegex = /^\d+[smhd]$/;

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().int().positive(),
  MONGO_URL_DEV: z.string().url(),
  MONGO_URL_PROD: z.string().url(),

  JWT_SECRET_KEY: z.string().min(10, {
    message: 'JWT secret key must be at least 10 characters long',
  }),
  JWT_REFRESH_KEY: z.string().min(10, {
    message: 'JWT refresh key must be at least 10 characters long',
  }),
  JWT_LIFE_TIME: z.string().regex(durationRegex, {
    message: 'Invalid JWT expiration format. Use: 10s, 30m, 1h, 7d.',
  }),
  BREVO_SMTP_HOST: z.string().refine(
    (val) => {
      const domainParts = val.split('.');
      return (
        domainParts.length > 2 &&
        domainParts[domainParts.length - 1] === 'com' &&
        domainParts[domainParts.length - 2] === 'brevo' &&
        domainParts[domainParts.length - 3] === 'smtp-relay'
      );
    },
    {
      message: 'Invalid SMTP host! Must be similar to smtp-relay.brevo.com',
    }
  ),
  BREVO_SMTP_PORT: z.coerce
    .number()
    .int()
    .positive({ message: 'SMTP port must be a positive integer!' }),
  BREVO_SMTP_USER: z.string().email({ message: 'Invalid SMTP user email!' }),
  BREVO_SMTP_PASS: z
    .string()
    .min(8, { message: 'SMTP password must be at least 8 characters long!' }),
  BREVO_DEFAULT_FROM: z
    .string()
    .email({ message: 'Invalid default from email!' }),
});

// Parse and validate environment variables
const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('\n❌ Configuration Validation Error:\n');

  result.error.errors.forEach((err) => {
    console.error(
      ` 🔴 Field: ${err.path.join('.')}\n    ❗ Error: ${err.message}`
    );
  });

  console.error(
    '\n💡 Fix the above errors in your .env file and restart the server.\n'
  );
  process.exit(1); // Stop execution due to invalid configuration
}

const CONFIG: Configuration = {
  env: result.data.NODE_ENV,
  server: {
    port: result.data.PORT,
    mongoUrl:
      result.data.NODE_ENV === 'development'
        ? result.data.MONGO_URL_DEV
        : result.data.MONGO_URL_PROD,
  },
  jwt: {
    secret: result.data.JWT_SECRET_KEY,
    refresh: result.data.JWT_REFRESH_KEY,
    life: result.data.JWT_LIFE_TIME as StringValue | number,
  },
  smtp: {
    host: result.data.BREVO_SMTP_HOST,
    port: result.data.BREVO_SMTP_PORT,
    user: result.data.BREVO_SMTP_USER,
    password: result.data.BREVO_SMTP_PASS,
    defaultFrom: result.data.BREVO_DEFAULT_FROM,
  },
};

export default CONFIG;
