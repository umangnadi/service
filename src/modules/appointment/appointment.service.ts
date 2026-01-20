import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class AppointmentService {
    constructor(
        private readonly prisma: PrismaService,
        ) { }


        async createAppointment(data: any) {
            return this.prisma.appointment.create({
                data,
            }); 
      }
}
