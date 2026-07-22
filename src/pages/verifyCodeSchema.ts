import { z } from 'zod';

export const OTP_LENGTH = 6;

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .length(OTP_LENGTH, `Enter the ${OTP_LENGTH}-digit code`)
    .regex(/^\d+$/, `Enter the ${OTP_LENGTH}-digit code`),
});

export type VerifyCodeFormValues = z.infer<typeof verifyCodeSchema>;
