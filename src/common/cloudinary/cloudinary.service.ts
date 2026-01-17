import { Inject, Injectable, Logger } from '@nestjs/common';
import type { v2 as Cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(
    @Inject('CLOUDINARY') private cloudinary: typeof Cloudinary,
  ) {}

  /**
   * Uploads a Fastify multipart image file to Cloudinary
   * 
   * @param image - Fastify multipart file object containing .value stream
   * @returns Cloudinary upload result with secure_url or null if failed/missing
   * @throws Error if upload fails
   */
  async uploadImage(image: any): Promise<any | null> {
  console.log('Cloudinary - image keys:', image ? Object.keys(image) : 'null');
  
  // Check Fastify properties FIRST
  if (!image || (!image.file && !image._buf && !image.toBuffer)) {
    this.logger.warn('No valid Fastify image provided');
    return null;
  }

  return new Promise<any>((resolve, reject) => {
    let buffer: Buffer;

    // Use Fastify's built-in buffer (SIMPLEST)
    if (image._buf) {
      buffer = image._buf;
    } else if (image.toBuffer) {
      // Use Fastify's built-in toBuffer method
      image.toBuffer().then((buf: Buffer) => {
        this.uploadToCloudinary(buf, resolve, reject);
      }).catch(reject);
      return;
    } else {
      // Fallback: stream from image.file
      const chunks: Buffer[] = [];
      image.file.on('data', (chunk: Buffer) => chunks.push(chunk));
      image.file.on('end', () => {
        buffer = Buffer.concat(chunks);
        this.uploadToCloudinary(buffer, resolve, reject);
      });
      image.file.on('error', reject);
      return;
    }

    // Direct buffer upload
    this.uploadToCloudinary(buffer, resolve, reject);
  });
}

private uploadToCloudinary(buffer: Buffer, resolve: any, reject: any) {
  this.cloudinary.uploader
    .upload_stream(
      { 
        folder: 'courses',
        resource_type: 'auto'
      }, 
      (error: any, result: any) => {
        if (error) {
          this.logger.error('Cloudinary upload failed', error);
          return reject(error);
        }
        this.logger.log(`Image uploaded: ${result.secure_url}`);
        resolve(result);
      }
    )
    .end(buffer);
}

}
