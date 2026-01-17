import { z } from 'zod';

export const UpdateCourseSchema = z.object({
  imageUrl: z.string().url().optional(),
  tag: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  duration: z.string().optional(),
  price: z.number().positive().optional(),
  syllabus: z.string().optional(),
});

export type UpdateCourseDto = z.infer<typeof UpdateCourseSchema>;
