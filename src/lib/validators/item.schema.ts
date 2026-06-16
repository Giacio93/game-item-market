import { z } from 'zod';

export const itemStatusSchema = z.enum([
  'AVAILABLE',
  'NEGOTIATION',
  'SOLD',
]);

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const itemFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Il nome item deve avere almeno 2 caratteri.')
    .max(120, 'Il nome item non può superare 120 caratteri.'),

  slug: z
    .string()
    .trim()
    .max(140, 'Lo slug non può superare 140 caratteri.')
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || slugRegex.test(value), {
      message: 'Lo slug può contenere solo lettere minuscole, numeri e trattini.',
    }),

  description: z
    .string()
    .trim()
    .min(10, 'La descrizione deve avere almeno 10 caratteri.')
    .max(2000, 'La descrizione non può superare 2000 caratteri.'),

  price: z.coerce
    .number()
    .min(0, 'Il prezzo non può essere negativo.')
    .max(999999.99, 'Il prezzo è troppo alto.'),


  highest_offer_price: z
    .union([
      z.literal(''),
      z.coerce
        .number()
        .min(0, 'Il prezzo offerto non può essere negativo.')
        .max(999999.99, 'Il prezzo offerto è troppo alto.'),
    ])
    .optional(),

  image_url: z
    .string()
    .trim()
    .url('URL immagine non valido.')
    .optional()
    .or(z.literal('')),

  status: itemStatusSchema,
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;