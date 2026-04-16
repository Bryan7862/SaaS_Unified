import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Extract company ID from header
    const companyId = req.headers["x-company-id"];
    if (companyId) {
      req["companyId"] = companyId;
    }

    // Attempt to decode token to look at userId if needed (optional here if AuthGuard does it)
    // But for global context context independent of AuthGuard, we can peek:
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = this.jwtService.decode(token);
        if (decoded && typeof decoded === "object") {
          req["user"] = { ...req["user"], ...decoded }; // Merge just in case
        }
      } catch (e) {
        // Ignore silent decoding errors in middleware
      }
    }

    next();
  }
}
