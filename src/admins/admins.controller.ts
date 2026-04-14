import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminsService } from './admins.service';
import { GetFormeResponse } from './response/getFormeResponse';
import { GetAllSpecialistsResponse } from './response/getAllSpecialists';
import { getAllPatientsResponse } from './response/getAllPatients';

@Controller('admins')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get('/get-forms')
  @ApiResponse({
    status: 200,
    description: 'Forms retrieved successfully.',
    type: GetFormeResponse,
  })
  async getForms(@Request() req) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.adminsService.getForms();
  }

  @Get('/get-specialists')
  @ApiResponse({
    status: 200,
    description: 'Specialists retrieved successfully.',
    type: GetAllSpecialistsResponse,
  })
  async getAllSpecialists(@Request() req) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.adminsService.getAllSpecialists();
  }

  @Get('/get-patients')
  @ApiResponse({
    status: 200,
    description: 'Patients retrieved successfully.',
    type: getAllPatientsResponse,
  })
  async getAllPatients(@Request() req) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.adminsService.getAllPatients();
  }

  @Get('/post')
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully.',
  })
  async getAllPosts(@Request() req) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.adminsService.getAllPosts();
  }

  @Patch('/post/:postId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully accepted.',
  })
  async acceptPost(@Request() req) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.adminsService.acceptPost(req.params.postId);
  }

  @Delete('/post/:postId')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'The post has been successfully deleted.',
    })
    async deletePost(@Request() req) {
        if (req.user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        return this.adminsService.deletePost(req.params.postId);
    }
}
