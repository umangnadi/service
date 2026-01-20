import { Injectable } from '@nestjs/common';
import type { CreateBookDto } from './dto/create-book.dto';
import type { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { apiResponse } from 'src/response/response';

@Injectable()
export class BookService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  /**
   * Create a new book (with optional image) 
   */
  async create(dto: CreateBookDto, image?: any) {
    let imageUrl: string | null = null;

    // Upload image if provided using CloudinaryService and fastify-file-upload
    if (image && image.file) {
      try {
        const result = await this.cloudinary.uploadImage(image);
        imageUrl = result?.secure_url || null;
      } catch (error) {
        console.error('BookService - Cloudinary FAILED:', error);
      }
    } else {
      console.log('BookService - No image.file found');
    }

    return this.prisma.book.create({
      data: {
        ...dto,
        imageUrl,
      },
    });
  }

  /**
   * Get all books
   */
  async findAll() {
    return apiResponse(200, 'Books fetched successfully', await this.prisma.book.findMany());
  }

  /**
   * Get one book by id
   */
  async findOne(id: number) {
    return apiResponse(200, 'Book fetched successfully', await this.prisma.book.findUnique({ where: { id } }));
  }

  /**
   * Update a book (with optional image) - 
   */
  async update(id: number, dto: UpdateBookDto, image?: any) {
    let imageUrl: string | undefined;

    if (image) {
      const uploaded = await this.cloudinary.uploadImage(image);
      imageUrl = uploaded.secure_url;
    }

    return apiResponse(200, 'Book updated successfully', await this.prisma.book.update({
      where: { id },
      data: {
        ...dto,
        ...(imageUrl && { imageUrl }),
      },
    }));
  }

  /**
   * Delete a book
   */
  async remove(id: number) {
    return apiResponse(200, 'Book deleted successfully', await this.prisma.book.delete({ where: { id } }));
  }
}
