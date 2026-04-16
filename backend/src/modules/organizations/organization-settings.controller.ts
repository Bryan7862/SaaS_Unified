import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from "@nestjs/common";
import { OrganizationsService } from "./organizations.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionsGuard } from "../iam/guards/permissions.guard";
import { RequirePermissions } from "../iam/decorators/require-permissions.decorator";
import { OrganizationSettings } from "./entities/organization-settings.entity";

@Controller("organizations/:id/settings")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrganizationSettingsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  @RequirePermissions("organizations:read")
  async findSettings(@Param("id") id: string, @Request() req) {
    this.validateContext(id, req);
    return this.organizationsService.getSettings(id);
  }

  @Patch()
  @RequirePermissions("organizations:update") // Usually OWNER/ADMIN
  async updateSettings(
    @Param("id") id: string,
    @Body() updateData: Partial<OrganizationSettings>,
    @Request() req,
  ) {
    this.validateContext(id, req);
    // Prevent updating companyId or other immutable fields if any
    delete updateData.companyId;

    return this.organizationsService.updateSettings(id, updateData);
  }

  private validateContext(paramId: string, req: any) {
    // Strict Tenant Isolation: URL Param must match Context Header
    const contextId = req.headers["x-company-id"];
    if (!contextId || contextId !== paramId) {
      throw new ForbiddenException(
        "Tenant Mismatch: You cannot access settings of another organization context.",
      );
    }
  }
}
