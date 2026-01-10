import { z } from 'zod';

// Runtime validation schema
export const CreateBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  fileUrl: z.string().url('File URL must be valid'),
  imageUrl: z.string().url().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  shippingInfo: z.string().optional(),
  price: z.number().nonnegative().optional(), // price can be 0
});

// TypeScript type inferred from Zod schema
export type CreateBookDto = z.infer<typeof CreateBookSchema>;
