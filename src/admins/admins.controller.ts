import { Controller, ForbiddenException, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminsService } from './admins.service';

@Controller('admins')
@UseGuards(AuthGuard)

@ApiBearerAuth()
export class AdminsController {
    constructor(private readonly adminsService: AdminsService){}

    @Get('/get-forms')
    async getForms(@Request() req){
        if(req.user.role !== 'ADMIN'){
            throw new ForbiddenException('Access denied');
        }
    return this.adminsService.getForms();
    }
}
