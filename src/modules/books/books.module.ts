import { Module } from '@nestjs/common';
import { BookService } from './books.service';
import { BookController } from './books.controller';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  controllers: [BookController],
  providers: [BookService, PrismaService],
})
export class BookModule {}
