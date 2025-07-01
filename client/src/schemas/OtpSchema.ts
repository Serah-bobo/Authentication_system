import { z } from "zod";

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must be numeric" }),
});

export type VerifyOtpSchemaType = z.infer<typeof verifyOtpSchema>;
