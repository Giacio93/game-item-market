import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Inserisci una email valida.'),

  password: z
    .string()
    .min(6, 'La password deve avere almeno 6 caratteri.'),

  redirectTo: z
    .string()
    .optional()
    .or(z.literal('')),
});

export type LoginFormValues = z.infer<typeof loginSchema>;