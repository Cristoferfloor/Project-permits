import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { GlobalRole } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  
  @Get('admin-only')
  @Roles(GlobalRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Route for SUPER_ADMIN only' })
  getAdminData() {
    return { 
      message: 'Welcome Super Admin',
      data: 'Confidential administrator information' 
    };
  }

  @Get('all-users')
  @Roles(GlobalRole.EMPLOYEE, GlobalRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Route for EMPLOYEE and SUPER_ADMIN' })
  getAllUsersData(@Request() req) {
    return {
      message: 'Data available to authenticated users',
      user: req.user,
    };
  }
}