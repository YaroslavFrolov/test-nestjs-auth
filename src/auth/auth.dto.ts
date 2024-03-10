import { z } from 'zod';

export const loginSchema = z
  .object({
    name: z.string().trim().min(3).max(20),
    password: z.string().trim().min(5).max(30),
  })
  .strict();

export const registerSchema = loginSchema;

export const refreshSchema = z
  .object({
    refresh_token: z.string().trim(),
  })
  .strict();

export type LoginDTO = z.infer<typeof loginSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
export type RefreshDTO = z.infer<typeof refreshSchema>;

export type TokensDTO = {
  access_token: string;
  refresh_token: string;
};

export type JwtPayload = {
  userId: number;
  userRoles: string[];
};
