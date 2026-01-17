import { z } from 'zod';

export const CreateCourseSchema = z.object({
  imageUrl: z.string().url().optional(),
  tag: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  duration: z.string().optional(),
  price: z.number().positive().optional(),
  syllabus: z.string().optional(),
});

export type CreateCourseDto = z.infer<typeof CreateCourseSchema>;
