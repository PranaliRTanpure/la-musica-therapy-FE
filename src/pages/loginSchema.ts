import { z } from 'zod';

/**
 * Single source of truth for the login form. The TS type is inferred
 * from the schema, so the form and its data never drift.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z.string().min(1, 'Temporary password is required'),
  captcha: z.string().trim().min(1, 'Enter the characters shown above'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
