import { z } from 'zod';

export const CreateCourseSchema = z.object({
  imageUrl: z.string().url().optional(),
  tag: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  duration: z.string().optional(),
  price: z.number().nonnegative().optional(),
  syllabus: z.string().optional(),
});

export type CreateCourseDto = z.infer<typeof CreateCourseSchema>;
