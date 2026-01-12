import { Injectable } from '@nestjs/common';
import type { CreateBookDto } from './dto/create-book.dto';
import type { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBookDto) {
    return this.prisma.book.create({ data });
  }

  async findAll() {
    return this.prisma.book.findMany();
  }

  async findOne(id: number) {
    return this.prisma.book.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateBookDto) {
    return this.prisma.book.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.book.delete({ where: { id } });
  }
}
