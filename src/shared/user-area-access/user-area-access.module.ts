import { Module } from '@nestjs/common';
import { UserAreaAccessService } from './user-area-access.service';
import { UserAreaAccessController } from './user-area-access.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersModule } from '../../users/users.module';
import { AreasModule } from '../areas/areas.module';

@Module({
  imports: [PrismaModule, UsersModule, AreasModule],
  controllers: [UserAreaAccessController],
  providers: [UserAreaAccessService],
  exports: [UserAreaAccessService],
})
export class UserAreaAccessModule {}