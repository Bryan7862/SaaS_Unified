import { IsEmail, IsNotEmpty, IsOptional, IsUUID, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @MinLength(2)
    firstName: string;

    @IsNotEmpty()
    @MinLength(2)
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @IsOptional()
    @IsUUID()
    defaultCompanyId?: string;
}
