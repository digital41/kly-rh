import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().default('dev-secret-change-in-production'),
  JWT_REFRESH_SECRET: z.string().default('dev-refresh-secret-change-in-production'),
  PORT: z.coerce.number().default(3000),
});

export const env = envSchema.parse(process.env);
