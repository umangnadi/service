import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  providers: [
    CloudinaryProvider, // 👈 THIS must be here
    CloudinaryService,
  ],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
