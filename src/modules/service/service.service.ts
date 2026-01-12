import { Injectable } from '@nestjs/common';
import type {UpdateServiceDto } from './dto/update-service.dto';
import type {CreateServiceDto} from './dto/create-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateServiceDto) {
    return this.prisma.service.create({ data });
  }

  async findAll() {
    return this.prisma.service.findMany();
  }

  async findOne(id: number) {
    return this.prisma.service.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateServiceDto) {
    return this.prisma.service.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.service.delete({ where: { id } });
  }
}
