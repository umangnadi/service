import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import { CourseService } from './course.service';

// 👇 TYPE-ONLY imports (IMPORTANT)
import type { CreateCourseDto } from './dto/create-course.dto';
import type { UpdateCourseDto } from './dto/update-course.dto';

// 👇 Zod schemas (runtime)
import { CreateCourseSchema } from './dto/create-course.dto';
import { UpdateCourseSchema } from './dto/update-course.dto';

import { ZodValidationPipe } from 'nestjs-zod';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('/create-course')
  create(
    @Body(new ZodValidationPipe(CreateCourseSchema))
    createCourseDto: CreateCourseDto,
  ) {
    return this.courseService.create(createCourseDto);
  }

  @Get('/get')
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateCourseSchema))
    updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.remove(id);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.courseService.findCoursesByStudent(studentId);
  }
}
