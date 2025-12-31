import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AreaCode } from '@prisma/client';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, code: AreaCode, description?: string) {
    return this.prisma.area.create({
      data: {
        name,
        code,
        description,
      },
    });
  }

  async findAll() {
    return this.prisma.area.findMany({
      where: { isActive: true },
      include: {
        users: {
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
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const area = await this.prisma.area.findUnique({
      where: { id },
      include: {
        users: {
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
          },
        },
      },
    });

    if (!area) {
      throw new NotFoundException('Área no encontrada');
    }

    return area;
  }

  async findByCode(code: AreaCode) {
    return this.prisma.area.findUnique({
      where: { code },
    });
  }

  async update(id: number, name?: string, description?: string) {
    return this.prisma.area.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
      },
    });
  }

  async deactivate(id: number) {
    return this.prisma.area.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async initializeDefaultAreas() {
    const areas = [
      {
        name: 'Desarrollo',
        code: AreaCode.DESARROLLO,
        description: 'Área de desarrollo de software',
      },
      {
        name: 'Implantación',
        code: AreaCode.IMPLANTACION,
        description: 'Área de implementación de soluciones',
      },
      {
        name: 'Soporte',
        code: AreaCode.SOPORTE,
        description: 'Área de soporte técnico',
      },
      {
        name: 'Gerencia',
        code: AreaCode.GERENCIA,
        description: 'Área de gerencia y dirección',
      },
      {
        name: 'Recursos Humanos',
        code: AreaCode.RECURSOS_HUMANOS,
        description: 'Área de gestión de recursos humanos',
      },
    ];

    for (const area of areas) {
      const exists = await this.findByCode(area.code);
      if (!exists) {
        await this.create(area.name, area.code, area.description);
      }
    }

    return { message: 'Áreas inicializadas correctamente' };
  }
}