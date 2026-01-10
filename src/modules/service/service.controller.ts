import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ServiceService } from './service.service';

import type { UpdateServiceDto } from './dto/update-service.dto';
import type { CreateServiceDto } from './dto/create-service.dto';
import { CreateServiceSchema} from './dto/create-service.dto';
import { UpdateServiceSchema } from './dto/update-service.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('/create-service')
  create(@Body(new ZodValidationPipe(CreateServiceSchema)) createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateServiceSchema)) updateServiceDto: UpdateServiceDto,
  ) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviceService.remove(id);
  }
}
