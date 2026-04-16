import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthCoreService } from "./auth-core.service";
import { AuthCoreController } from "./auth-core.controller";
import { User } from "./entities/user.entity";
import { Role } from "./entities/role.entity";
import { Permission } from "./entities/permission.entity";
import { UserRole } from "./entities/user-role.entity";
import { RolePermission } from "./entities/role-permission.entity";
import { Company } from "./entities/company.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      UserRole,
      RolePermission,
      Company,
    ]),
  ],
  controllers: [AuthCoreController],
  providers: [AuthCoreService],
  exports: [AuthCoreService],
})
export class AuthCoreModule {}
