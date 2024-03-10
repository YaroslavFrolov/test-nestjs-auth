import { z } from 'zod';

export const envSchema = z.object({
  PORT_APP: z.coerce.number(),
  PORT_DB: z.coerce.number(),
  PORT_REDIS: z.coerce.number(),

  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),

  ACCESS_TOKEN_KEY: z.string(),
  REFRESH_TOKEN_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
