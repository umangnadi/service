import { Injectable } from '@nestjs/common';
import type { CreateServiceDto } from './dto/create-service.dto';
import type { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { apiResponse } from 'src/response/response';

@Injectable()
export class ServiceService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinary: CloudinaryService,  
  ) {}

  async create(dto: CreateServiceDto, image?: any) {  
    let imageUrl: string | null = null;

    // Upload image if provided 
    if (image && image.file) {
      try {
        const result = await this.cloudinary.uploadImage(image);
        imageUrl = result?.secure_url || null;
      } catch (error) {
        console.error('ServiceService - Cloudinary FAILED:', error);
      }
    } else {
      console.log('ServiceService - No image.file found');
    }

    return apiResponse(201, 'Service created successfully', await this.prisma.service.create({ 
      data: {
        ...dto,
        imageUrl,  //  From Cloudinary
      } 
    }));
  }

  async findAll() {
    return apiResponse(200, 'Services fetched successfully', await this.prisma.service.findMany());
  }

  async findOne(id: number) {
    return apiResponse(200, 'Service fetched successfully', await this.prisma.service.findUnique({ where: { id } }));
  }

  async update(id: number, dto: UpdateServiceDto, image?: any) {  // ← Added image param
    let imageUrl: string | undefined;

    if (image) {
      const uploaded = await this.cloudinary.uploadImage(image);
      imageUrl = uploaded.secure_url;
    }

    return apiResponse(200, 'Service updated successfully', await this.prisma.service.update({ 
      where: { id }, 
      data: {
        ...dto,
        ...(imageUrl && { imageUrl }),
      },
    }));
  }

  async remove(id: number) {
    return apiResponse(200, 'Service removed successfully', await this.prisma.service.delete({ where: { id } }));
  }
}
