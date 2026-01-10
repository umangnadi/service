import { z } from 'zod';

// Runtime validation schema
export const CreateServiceSchema = z.object({
  imageUrl: z.string().url().optional(),
  tag: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().nonnegative().optional(), // allow free services
});

// TypeScript type inferred from Zod schema
export type CreateServiceDto = z.infer<typeof CreateServiceSchema>;
