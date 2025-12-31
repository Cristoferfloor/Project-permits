import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AreaPermission } from '@prisma/client';

@Injectable()
export class UserAreaAccessService {
  constructor(private prisma: PrismaService) {}

  async assignUserToArea(
    userId: number,
    areaId: number,
    permissions: AreaPermission[],
    isAdmin: boolean = false,
  ) {
    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que el área existe
    const area = await this.prisma.area.findUnique({
      where: { id: areaId },
    });

    if (!area) {
      throw new NotFoundException('Área no encontrada');
    }

    // Verificar si ya existe la asignación
    const existing = await this.prisma.userAreaAccess.findUnique({
      where: {
        userId_areaId: {
          userId,
          areaId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('El usuario ya está asignado a esta área');
    }

    return this.prisma.userAreaAccess.create({
      data: {
        userId,
        areaId,
        permissions,
        isAdmin,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            globalRole: true,
          },
        },
        area: true,
      },
    });
  }

  async updateUserAreaAccess(
    userId: number,
    areaId: number,
    permissions?: AreaPermission[],
    isAdmin?: boolean,
  ) {
    const access = await this.prisma.userAreaAccess.findUnique({
      where: {
        userId_areaId: {
          userId,
          areaId,
        },
      },
    });

    if (!access) {
      throw new NotFoundException('Asignación no encontrada');
    }

    return this.prisma.userAreaAccess.update({
      where: {
        userId_areaId: {
          userId,
          areaId,
        },
      },
      data: {
        ...(permissions && { permissions }),
        ...(isAdmin !== undefined && { isAdmin }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            globalRole: true,
          },
        },
        area: true,
      },
    });
  }

  async removeUserFromArea(userId: number, areaId: number) {
    const access = await this.prisma.userAreaAccess.findUnique({
      where: {
        userId_areaId: {
          userId,
          areaId,
        },
      },
    });

    if (!access) {
      throw new NotFoundException('Asignación no encontrada');
    }

    await this.prisma.userAreaAccess.delete({
      where: {
        userId_areaId: {
          userId,
          areaId,
        },
      },
    });

    return { message: 'Usuario removido del área exitosamente' };
  }

  async getUserAreas(userId: number) {
    return this.prisma.userAreaAccess.findMany({
      where: { userId },
      include: {
        area: true,
      },
    });
  }

  async getAreaUsers(areaId: number) {
    return this.prisma.userAreaAccess.findMany({
      where: { areaId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            globalRole: true,
            isActive: true,
          },
        },
      },
    });
  }

  async userHasPermission(
    userId: number,
    areaId: number,
    permission: AreaPermission,
  ): Promise<boolean> {
    const access = await this.prisma.userAreaAccess.findUnique({
      where: {
        userId_areaId: {
          userId,
          areaId,
        },
      },
    });

    if (!access) {
      return false;
    }

    return access.permissions.includes(permission);
  }

  async userIsAreaAdmin(userId: number, areaId: number): Promise<boolean> {
    const access = await this.prisma.userAreaAccess.findUnique({
      where: {
        userId_areaId: {
          userId,
          areaId,
        },
      },
    });

    return access?.isAdmin || false;
  }
}