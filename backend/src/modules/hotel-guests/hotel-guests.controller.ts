import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Put,
} from "@nestjs/common";
import { HotelGuestsService } from "./hotel-guests.service";
import { CreateGuestDto } from "./dto/create-guest.dto";
import { UpdateGuestDto } from "./dto/update-guest.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ActiveCompanyId } from "../../common/decorators/active-company-id.decorator";

@Controller("hotel-guests")
@UseGuards(JwtAuthGuard)
export class HotelGuestsController {
  constructor(private readonly hotelGuestsService: HotelGuestsService) {}

  @Post()
  create(
    @Body() createGuestDto: CreateGuestDto,
    @ActiveCompanyId() companyId: string,
  ) {
    return this.hotelGuestsService.registerGuest(companyId, createGuestDto);
  }

  @Get()
  findAll(
    @ActiveCompanyId() companyId: string,
    @Query("documentNumber") documentNumber?: string,
  ) {
    if (documentNumber) {
      return this.hotelGuestsService.findGuestByDocumentNumber(
        companyId,
        documentNumber,
      );
    }
    return this.hotelGuestsService.listAllGuestsByCompany(companyId);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @ActiveCompanyId() companyId: string) {
    return this.hotelGuestsService.findOne(companyId, id);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateGuestDto: UpdateGuestDto,
    @ActiveCompanyId() companyId: string,
  ) {
    return this.hotelGuestsService.updateGuestContactInfo(
      companyId,
      id,
      updateGuestDto,
    );
  }
}
