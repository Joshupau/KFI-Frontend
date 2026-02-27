import z from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  deviceName: z.string().optional(),
  deviceType: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
