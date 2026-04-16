import { IsString, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsUUID()
  @IsNotEmpty()
  floorId: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsOptional()
  status?: string;
}
