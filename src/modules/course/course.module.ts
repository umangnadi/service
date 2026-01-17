import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { PrismaModule } from 'src/prisma/prisma.module';

import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
