import { z } from 'zod';

const optionalUrl = z
  .string()
  .trim()
  .url('URL invalide.')
  .max(2048, 'URL trop longue.')
  .optional()
  .or(z.literal(''));

export const projectSchema = z.object({
  title: z.string().trim().min(1, 'Le titre est requis.').max(160, 'Titre trop long.'),
  description: z
    .string()
    .trim()
    .min(1, 'La description est requise.')
    .max(5000, 'Description trop longue.'),
  content: z.string().trim().max(50000, 'Contenu trop long.').optional(),
  link: optionalUrl,
  githubUrl: optionalUrl,
  imageUrl: optionalUrl,
  tags: z
    .union([
      z.string().transform((value) => value.split(',').map((tag) => tag.trim()).filter(Boolean)),
      z.array(z.string().trim().min(1).max(50)).max(30),
    ])
    .default([]),
  published: z.boolean().optional(),
});

export const appointmentSchema = z.object({
  guestName: z.string().trim().min(2, 'Le nom est requis.').max(120, 'Nom trop long.'),
  guestEmail: z.string().trim().email('Adresse email invalide.').max(320),
  date: z.coerce.date().refine((date) => date.getTime() > Date.now(), {
    message: 'La date du rendez-vous doit être future.',
  }),
  serviceId: z.string().trim().min(1, 'Le service est requis.').max(25, 'Service invalide.'),
});

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Le nom est requis.').max(120, 'Nom trop long.'),
  email: z.string().trim().email('Adresse email invalide.').max(320),
  company: z.string().trim().max(160, 'Nom d’entreprise trop long.').optional(),
  notes: z.string().trim().max(10000, 'Note trop longue.').optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Adresse email invalide.').max(320),
  password: z.string().min(1, 'Le mot de passe est requis.').max(200),
});

export const chatSchema = z.object({
  question: z.string().trim().min(2, 'La question est requise.').max(2000, 'Question trop longue.'),
});

export const messageSchema = z.object({
  guestName: z.string().trim().min(2, 'Le nom est requis.').max(120),
  guestEmail: z.string().trim().email('Adresse email invalide.').max(320),
  content: z.string().trim().min(1, 'Le message est requis.').max(10000),
});

export const leadStatusSchema = z.enum(['NOUVEAU', 'CONTACTE', 'PROPOSITION', 'GAGNE', 'PERDU']);
