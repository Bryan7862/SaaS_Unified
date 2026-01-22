import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HotelGuest } from './entities/hotel-guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class HotelGuestsService {
    constructor(
        @InjectRepository(HotelGuest)
        private guestRepository: Repository<HotelGuest>,
    ) { }

    async registerGuest(companyId: string, createGuestDto: CreateGuestDto): Promise<HotelGuest> {
        // Validate duplicates within the company
        await this.checkDuplicateDocument(companyId, createGuestDto.documentNumber);

        const guest = this.guestRepository.create({
            ...createGuestDto,
            companyId,
        });

        return this.guestRepository.save(guest);
    }

    async findGuestByDocumentNumber(companyId: string, documentNumber: string): Promise<HotelGuest | null> {
        return this.guestRepository.findOne({
            where: { companyId, documentNumber }
        });
    }

    async listAllGuestsByCompany(companyId: string): Promise<HotelGuest[]> {
        return this.guestRepository.find({
            where: { companyId },
            order: { lastName: 'ASC', firstName: 'ASC' }
        });
    }

    async updateGuestContactInfo(companyId: string, id: string, updateGuestDto: UpdateGuestDto): Promise<HotelGuest> {
        const guest = await this.guestRepository.findOne({ where: { id, companyId } });
        if (!guest) throw new NotFoundException('Guest not found within this organization.');

        // If updating document number, check for duplicates again (unless it's the same guest)
        if (updateGuestDto.documentNumber && updateGuestDto.documentNumber !== guest.documentNumber) {
            await this.checkDuplicateDocument(companyId, updateGuestDto.documentNumber);
        }

        Object.assign(guest, updateGuestDto);
        return this.guestRepository.save(guest);
    }

    async findOne(companyId: string, id: string): Promise<HotelGuest> {
        const guest = await this.guestRepository.findOne({ where: { id, companyId } });
        if (!guest) throw new NotFoundException('Guest not found.');
        return guest;
    }

    private async checkDuplicateDocument(companyId: string, documentNumber: string): Promise<void> {
        const existing = await this.findGuestByDocumentNumber(companyId, documentNumber);
        if (existing) {
            throw new ConflictException(`Guest with document ${documentNumber} already exists in this organization.`);
        }
    }
}
