import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AreasModule } from './shared/areas/areas.module';
import { UserAreaAccessModule } from './shared/user-area-access/user-area-access.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    AreasModule,
    UserAreaAccessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}