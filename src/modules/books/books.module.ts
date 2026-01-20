import { Module } from '@nestjs/common';
import { BookService } from './books.service';
import { BookController } from './books.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';
import { MailService } from 'src/common/nodemailer/mail.service';


@Module({
  imports: [
    CloudinaryModule
  ],
  controllers: [BookController],
  providers: [BookService, PrismaService],
})
export class BookModule {}
