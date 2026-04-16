import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { AuthCoreService } from "./auth-core.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { RegisterDto } from "./dto/register.dto";
import { CreateRoleDto } from "./dto/create-role.dto";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { AssignRoleDto } from "./dto/assign-role.dto";

@Controller("admin/auth")
export class AuthCoreController {
  constructor(private readonly authCoreService: AuthCoreService) {}

  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.authCoreService.register(registerDto);
  }

  @Post("users")
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authCoreService.createUser(createUserDto);
  }

  @Get("users")
  getUsers() {
    return this.authCoreService.getUsers();
  }

  @Post("roles")
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.authCoreService.createRole(createRoleDto);
  }

  @Get("roles")
  getRoles() {
    return this.authCoreService.getRoles();
  }

  @Post("permissions")
  createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.authCoreService.createPermission(createPermissionDto);
  }

  @Get("permissions")
  getPermissions() {
    return this.authCoreService.getPermissions();
  }

  @Post("users/assign-role")
  assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.authCoreService.assignRole(assignRoleDto);
  }

  @Post("roles/:roleId/permissions/:permissionId")
  addPermissionToRole(
    @Param("roleId") roleId: string,
    @Param("permissionId") permissionId: string,
  ) {
    return this.authCoreService.addPermissionToRole(roleId, permissionId);
  }
}
