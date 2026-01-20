import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceSchema } from './dto/create-service.dto';
import { UpdateServiceSchema } from './dto/update-service.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import type { FastifyRequest } from 'fastify';

@Controller('services')  
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('/create-service')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Req() req: FastifyRequest) {  // ← FormData pattern
    const body = req.body as Record<string, any>;
    
    const validatedData = CreateServiceSchema.parse({
      title: body.title?.value || '',
      description: body.description?.value || '',
      price: Number(body.price?.value || 0),
      tag: body.tag?.value || '',
    });

    return this.serviceService.create(validatedData, body.image);  // ← Pass image
  }

  @Get('/get-all-services')
  findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceService.findOne(id);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(@Param('id', ParseIntPipe) id: number, @Req() req: any) {  // ← FormData pattern
    const body = req.body;
    const image = body.image;

    const validatedData = UpdateServiceSchema.parse({
      title: body.title?.value,
      description: body.description?.value,
      price: Number(body.price?.value),
      tag: body.tag?.value,
    });

    return this.serviceService.update(id, validatedData, image);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviceService.remove(id);
  }
}
