import { Controller, Get, Post, Delete, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { BookService } from './books.service';
import { CreateBookSchema } from './dto/create-book.dto';
import { UpdateBookSchema } from './dto/update-book.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import type { FastifyRequest } from 'fastify';

@Controller('books') // Fixed prefix to match logs
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('create-book')
  async create(@Req() req: FastifyRequest) {
    const body = req.body as Record<string, any>;

    // Manual parsing + Zod validation ()
    const validatedData = CreateBookSchema.parse({
      title: body.title?.value || '',
      description: body.description?.value || '',
      fileUrl: body.fileUrl?.value || '',
      price: Number(body.price?.value || 0),
      category: body.category?.value || '',
      author: body.author?.value || '',
      shippingInfo: body.shippingInfo?.value || '',
    });

    return this.bookService.create(validatedData, body.image);
  }

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const body = req.body;
    const image = body.image;

    const validatedData = UpdateBookSchema.parse({
      title: body.title?.value,
      description: body.description?.value,
      fileUrl: body.fileUrl?.value,
      price: Number(body.price?.value),
      category: body.category?.value,
      author: body.author?.value,
      shippingInfo: body.shippingInfo?.value,
    });

    return this.bookService.update(id, validatedData, image);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id);
  }
}
