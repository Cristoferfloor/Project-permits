import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserAreaAccessService } from './user-area-access.service';
import { AssignUserAreaDto } from './dto/assign-user-area.dto';
import { UpdateUserAreaDto } from './dto/update-user-area.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { GlobalRole } from '@prisma/client';

@ApiTags('User Area Access')
@Controller('user-area-access')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserAreaAccessController {
  constructor(
    private readonly userAreaAccessService: UserAreaAccessService,
  ) {}

  @Post('assign')
  @Roles(GlobalRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Asignar usuario a un área (Solo SUPER_ADMIN)' })
  assignUserToArea(@Body() dto: AssignUserAreaDto) {
    return this.userAreaAccessService.assignUserToArea(
      dto.userId,
      dto.areaId,
      dto.permissions,
      dto.isAdmin,
    );
  }

  @Patch('update/:userId/:areaId')
  @Roles(GlobalRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Actualizar permisos de usuario en área (Solo SUPER_ADMIN)' })
  updateUserAreaAccess(
    @Param('userId') userId: string,
    @Param('areaId') areaId: string,
    @Body() dto: UpdateUserAreaDto,
  ) {
    return this.userAreaAccessService.updateUserAreaAccess(
      +userId,
      +areaId,
      dto.permissions,
      dto.isAdmin,
    );
  }

  @Delete('remove/:userId/:areaId')
  @Roles(GlobalRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Remover usuario de un área (Solo SUPER_ADMIN)' })
  removeUserFromArea(
    @Param('userId') userId: string,
    @Param('areaId') areaId: string,
  ) {
    return this.userAreaAccessService.removeUserFromArea(+userId, +areaId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener áreas de un usuario' })
  getUserAreas(@Param('userId') userId: string) {
    return this.userAreaAccessService.getUserAreas(+userId);
  }

  @Get('area/:areaId')
  @ApiOperation({ summary: 'Obtener usuarios de un área' })
  getAreaUsers(@Param('areaId') areaId: string) {
    return this.userAreaAccessService.getAreaUsers(+areaId);
  }

  @Get('my-areas')
  @ApiOperation({ summary: 'Obtener mis áreas asignadas' })
  getMyAreas(@Request() req) {
    return this.userAreaAccessService.getUserAreas(req.user.id);
  }
}