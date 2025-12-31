import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { GlobalRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    example: 'user@test.com',
  })
  @IsEmail({}, { message: 'Email no válido' })
  email: string;

  @ApiProperty({
    example: '123456',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, {
    message: 'Password mínimo 6 caracteres',
  })
  password: string;

  @ApiProperty({
    example: 'Juan',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    example: 'Pérez',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: 'EMPLOYEE',
    enum: GlobalRole,
    required: false,
    description: 'Rol global del usuario (por defecto VIEWER)',
  })
  @IsOptional()
  @IsEnum(GlobalRole)
  globalRole?: GlobalRole;
}