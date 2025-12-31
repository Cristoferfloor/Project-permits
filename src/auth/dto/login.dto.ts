import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@test.com',
  })
  @IsEmail({}, { message: 'Email no válido' })
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  password: string;
}
