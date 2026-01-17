import { FileInterceptor } from '@nestjs/platform-express';
import { cloudinaryStorage } from '../cloudinary/cloudinary.storage';

export const CloudinaryUpload = (fieldName = 'file') =>
  FileInterceptor(fieldName, {
    storage: cloudinaryStorage,
  });
