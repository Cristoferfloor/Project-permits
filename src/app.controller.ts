import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GlobalRole } from '@prisma/client';

@ApiTags('Protected')
@Controller()
export class AppController {

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // Ruta solo para SUPER_ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @Get('admin')
  getAdminData(@Request() req) {
    return {
      message: 'Esta ruta es solo para SUPER_ADMIN',
      user: req.user,
    };
  }

  // Ruta para EMPLOYEE y SUPER_ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalRole.EMPLOYEE, GlobalRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @Get('employees')
  getEmployeesData(@Request() req) {
    return {
      message: 'Esta ruta es para empleados',
      user: req.user,
    };
  }
}