import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GlobalRole, AreaCode } from '@prisma/client';
import {
  AREA_PERMISSION_KEY,
  AreaPermissionRequirement,
} from '../decorators/area-permission.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AreaPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirement = this.reflector.getAllAndOverride<AreaPermissionRequirement>(
      AREA_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requirement) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // SUPER_ADMIN siempre tiene acceso
    if (user.globalRole === GlobalRole.SUPER_ADMIN) {
      return true;
    }

    // Buscar el área
    const area = await this.prisma.area.findUnique({
      where: { code: requirement.area },
    });

    if (!area) {
      throw new ForbiddenException('Área no encontrada');
    }

    // Buscar el acceso del usuario al área
    const access = await this.prisma.userAreaAccess.findUnique({
      where: {
        userId_areaId: {
          userId: user.id,
          areaId: area.id,
        },
      },
    });

    if (!access) {
      throw new ForbiddenException('No tienes acceso a esta área');
    }

    // Si es admin del área, tiene todos los permisos
    if (access.isAdmin) {
      return true;
    }

    // Verificar si tiene los permisos requeridos
    const hasPermissions = requirement.permissions.every((permission) =>
      access.permissions.includes(permission),
    );

    if (!hasPermissions) {
      throw new ForbiddenException(
        'No tienes los permisos necesarios para esta acción',
      );
    }

    return true;
  }
}