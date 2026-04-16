import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

export const ActiveCompanyId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException("User context not found in request");
    }

    const companyId =
      user.companyId || user.organizationId || user.defaultCompanyId;

    if (!companyId) {
      throw new UnauthorizedException(
        "Company ID not found in user context. User may be missing a valid organization assignment.",
      );
    }

    return companyId;
  },
);
