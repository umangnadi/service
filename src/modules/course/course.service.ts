import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { apiResponse } from 'src/response/response';

@Injectable()
export class CourseService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  /**
   * Create a new course (with optional image)
   */
 async create(dto: CreateCourseDto, image?: any) {
  
  
  let imageUrl: string | null = null;

  // Upload image if provided using CloudinaryService and fastify-file-upload
  if (image && image.file) {
    try {
      const result = await this.cloudinary.uploadImage(image);
      imageUrl = result?.secure_url || null;
      } catch (error) {
      console.error('CourseService - Cloudinary FAILED:', error);
    }
  } else {
    console.log('CourseService - No image.file found');
  }

  return this.prisma.course.create({
    data: {
      ...dto,
      imageUrl,
    },
  });
}



  /**
   * Get all courses
   */
  async findAll() {
    return apiResponse(200, 'Courses fetched successfully', await this.prisma.course.findMany());
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
   * Update a course (with optional image)
   */
  async update(id: number, dto: UpdateCourseDto, image?: any) {
    let imageUrl: string | undefined;

    if (image) {
      const uploaded = await this.cloudinary.uploadImage(image);
      imageUrl = uploaded.secure_url;
    }

    return apiResponse(200, 'Course updated successfully', await this.prisma.course.update({
      where: { id },
      data: {
        ...dto,
        ...(imageUrl && { imageUrl }),
      },
    }));
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
