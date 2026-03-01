import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';
import type { UpsertProfileDTO } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get(':userId')
    get(@Param('userId') userId: string) {
        return this.profileService.get(userId);
    }

    @Put(':userId')
    upsert(@Param('userId') userId: string, @Body() body: UpsertProfileDTO) {
        return this.profileService.upsert(userId, body);
    }
}
