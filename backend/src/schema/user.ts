import { password } from "bun";
import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  email: z.string().email(),
  created_at: z.date(),
});

export const CreateUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8),
});

export const SignInUserSchema = CreateUserSchema.pick({
  email: true,
  password: true,
});

export const ForgetPasswordSchema = z.object({
  email: z.string().email(),
});

export const BaseResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export const ResetPasswordFormSchema = BaseResetPasswordSchema.omit({
  token: true,
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "password and confirmPassword must match",
      path: ["confirmPassword"],
    });
  }
});

export const ResetPasswordSchema = BaseResetPasswordSchema.superRefine(
  (data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "password and confirmPassword must match",
        path: ["confirmPassword"],
      });
    }
  },
);

export const ForgetPasswordResponseSchema = z.object({
  message: z.string(),
});

export const ResetPasswordResponseSchema = z.object({
  message: z.string(),
});

export const generateUserResponseSchema = (dataSchema: z.ZodObject<any>) => {
  return z.object({
    message: z.string(),
    data: dataSchema,
    token: z.string(),
  });
};
