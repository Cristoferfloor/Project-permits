import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { GlobalRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    globalRole?: GlobalRole,
    firstName?: string,
    lastName?: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create(
      email,
      hashedPassword,
      globalRole || GlobalRole.VIEWER,
      firstName,
      lastName,
    );

    return {
      message: 'Usuario creado correctamente',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        globalRole: user.globalRole,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Usuario no existe');
    }

    const passwordOk = await bcrypt.compare(password, user.password);

    if (!passwordOk) {
      throw new UnauthorizedException('Password incorrecto');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      globalRole: user.globalRole,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        globalRole: user.globalRole,
        areas: user.areaAccess.map((access) => ({
          area: access.area.name,
          permissions: access.permissions,
          isAdmin: access.isAdmin,
        })),
      },
    };
  }
}