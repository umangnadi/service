import { CreateCourseSchema } from './create-course.dto';
import { z } from 'zod';

export const UpdateCourseSchema = CreateCourseSchema.partial();

export type UpdateCourseDto = z.infer<typeof UpdateCourseSchema>;
