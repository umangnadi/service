import { z } from 'zod';
import { CreateBookSchema } from './create-book.dto';

// Make all fields optional for updates
export const UpdateBookSchema = CreateBookSchema.partial();

export type UpdateBookDto = z.infer<typeof UpdateBookSchema>;
