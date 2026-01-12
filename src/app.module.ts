import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ServiceModule } from './modules/service/service.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { OrderModule } from './modules/order/order.module';
import { CourseModule } from './modules/course/course.module';
import { BookModule } from './modules/books/books.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    AuthModule,
    UsersModule,
    BookModule,
    ServiceModule,
    AppointmentModule,
    OrderModule,
    CourseModule,
    PrismaModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
