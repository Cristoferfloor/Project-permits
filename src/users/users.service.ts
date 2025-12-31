import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GlobalRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        areaAccess: {
          include: {
            area: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        areaAccess: {
          include: {
            area: true,
          },
        },
      },
    });
  }

  async create(
    email: string,
    password: string,
    globalRole: GlobalRole = GlobalRole.VIEWER,
    firstName?: string,
    lastName?: string,
    createdById?: number,
  ) {
    const exists = await this.findByEmail(email);

    if (exists) {
      throw new ConflictException('El email ya está registrado');
    }

    return this.prisma.user.create({
      data: {
        email,
        password,
        globalRole,
        firstName,
        lastName,
        createdById,
      },
      include: {
        areaAccess: {
          include: {
            area: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        globalRole: true,
        isActive: true,
        createdAt: true,
        areaAccess: {
          include: {
            area: true,
          },
        },
      },
    });
  }
}