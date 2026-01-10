import { z } from 'zod';
import { CreateServiceSchema } from './create-service.dto';

// Make all fields optional for updates
export const UpdateServiceSchema = CreateServiceSchema.partial();

export type UpdateServiceDto = z.infer<typeof UpdateServiceSchema>;
