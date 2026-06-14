import { z } from 'zod';

export const offerStatusSchema = z.enum([
  'NEW',
  'NEGOTIATION',
  'ACCEPTED',
  'REJECTED',
]);

export const createOfferSchema = z.object({
  item_id: z.string().uuid('Item non valido.'),

  nickname: z
    .string()
    .trim()
    .min(2, 'Inserisci almeno 2 caratteri.')
    .max(40, 'Il nickname non può superare 40 caratteri.'),

  contact: z
    .string()
    .trim()
    .min(3, 'Inserisci un contatto Discord o WhatsApp valido.')
    .max(80, 'Il contatto non può superare 80 caratteri.'),

  amount: z.coerce
    .number()
    .positive('L’offerta deve essere maggiore di 0.')
    .max(999999.99, 'Importo troppo alto.'),

  message: z
    .string()
    .trim()
    .max(500, 'Il messaggio non può superare 500 caratteri.')
    .optional()
    .or(z.literal('')),

  website: z
    .string()
    .max(0, 'Richiesta non valida.')
    .optional()
    .or(z.literal('')),

  started_at: z.coerce.number(),
});

export const updateOfferStatusSchema = z.object({
  id: z.string().uuid('Offerta non valida.'),
  status: offerStatusSchema,
});

export type CreateOfferFormValues = z.infer<typeof createOfferSchema>;
export type UpdateOfferStatusValues = z.infer<typeof updateOfferStatusSchema>;