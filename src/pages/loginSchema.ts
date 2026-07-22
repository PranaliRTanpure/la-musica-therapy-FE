import { z } from 'zod';

/**
 * Single source of truth for the login form. The TS type is inferred
 * from the schema, so the form and its data never drift.
 *
 * `captcha` is only rendered (and only required) on the patient variant;
 * `rememberMe` only on the provider variant — see `LoginPage`.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z.string().min(1, 'Temporary password is required'),
  captcha: z.string().trim(),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
