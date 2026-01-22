import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateGuestDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    documentType: string;

    @IsNotEmpty()
    @IsString()
    documentNumber: string;

    @IsOptional()
    @IsString()
    nationality?: string;

    @IsOptional()
    @IsString()
    cityOfOrigin?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}
