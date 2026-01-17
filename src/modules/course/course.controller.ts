import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards, Req, Version } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseSchema } from './dto/create-course.dto';
import { UpdateCourseSchema } from './dto/update-course.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import type { FastifyRequest } from 'fastify';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('/create-course')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Req() req: FastifyRequest) {
    const body = req.body as Record<string, any>;
    const title = body.title?.value || '';
    const description = body.description?.value || '';
    const price = Number(body.price?.value || 0);
    const syllabus = body.syllabus?.value || '';
    const duration = body.duration?.value || '';
    const tag = body.tag?.value || '';
    const validatedData = CreateCourseSchema.parse({
      title,
      description,
      price,
      syllabus,
      duration,
      tag,
    });

    return this.courseService.create(validatedData, body.image);
  }

  // Get all courses 
  @Get("/get-all-courses") findAll() {
    return this.courseService.findAll();
  }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findOne(id);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const body = req.body;
    const image = body.image;

    const validatedData = UpdateCourseSchema.parse({
      title: body.title?.value,
      description: body.description?.value,
      price: Number(body.price?.value),
      syllabus: body.syllabus?.value,
      duration: body.duration?.value,
      tag: body.tag?.value,
    });

    return this.courseService.update(id, validatedData, image);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.remove(id);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.courseService.findCoursesByStudent(studentId);
  }
}
