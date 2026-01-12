import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new course
   */
  async create(createCourseDto: CreateCourseDto) {
    return this.prisma.course.create({
      data: createCourseDto,
    });
  }

  /**
   * Get all courses
   */
  async findAll() {
    return this.prisma.course.findMany({
      include: {
        enrollments: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get one course by id
   */
  async findOne(id: number) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Update a course
   */
  async update(id: number, updateCourseDto: UpdateCourseDto) {
    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
    });
  }

  /**
   * Delete a course
   */
  async remove(id: number) {
    return this.prisma.course.delete({
      where: { id },
    });
  }

  /**
   * Find all courses a student is enrolled in
   */
  async findCoursesByStudent(studentId: number) {
    return this.prisma.enrollment.findMany({
      where: { studentId },
      include: { course: true },
    });
  }
}
