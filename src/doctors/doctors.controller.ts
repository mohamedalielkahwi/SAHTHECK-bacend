import {
  Body, Controller, ForbiddenException, Get,
  Patch,
  Post, Request, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { DoctorsService } from './doctors.service';
import { getAllPatientsResponse } from './response/getAllPatient';
import { GetFormeResponse } from './response/getForme';
import { createPosteDto } from './DTO/createPosteDto';
import { CreateDailySlotsDto } from './DTO/createDailySlotsDto';
import { GetAllSlotsResponse } from './response/getAllSlots';
import { ModifyApointmentDto } from './DTO/ModifyApointmentDto';

@Controller('doctors')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get('/get-patients')
  @ApiResponse({ status: 200, type: getAllPatientsResponse })
  async getPatients(@Request() req) {
    if (req.user.role !== 'DOCTOR') throw new ForbiddenException('Access denied');
    return this.doctorsService.getPatients(req.user.userId);
  }

  @Get('/get-forms')
  @ApiResponse({ status: 200, type: GetFormeResponse })
  async getForms(@Request() req) {
    if (req.user.role !== 'DOCTOR') throw new ForbiddenException('Access denied');
    return this.doctorsService.getForms(req.user.userId);
  }

  @Get('/my_posts')
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully.' })
  async getMyPosts(@Request() req) {
    if (req.user.role !== 'DOCTOR') throw new ForbiddenException('Access denied');
    return this.doctorsService.getMyPosts(req.user.userId);
  }

  @Post('/my_posts')
  @ApiResponse({ status: 201, description: 'Post created successfully.' })
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for videos
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
        return cb(new Error('Only image and video files are allowed'), false);
      }
      cb(null, true);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        type: { type: 'string', enum: ['ARTICLE', 'VIDEO', 'IMAGE'] },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async createPost(
    @Request() req,
    @Body() createPosteDto: createPosteDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (req.user.role !== 'DOCTOR') throw new ForbiddenException('Access denied');
    return this.doctorsService.createPost(req.user.userId, createPosteDto, file);
  }

  @Post('/daily-slots')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The daily slots have been successfully created.',
  })
  async createADailySlots(@Request() req, @Body() createDailySlotsDto: CreateDailySlotsDto) {
    if (req.user.role !== 'DOCTOR') throw new ForbiddenException('Access denied');
    return this.doctorsService.createADailySlots(req.user.userId, createDailySlotsDto);
  }

  @Get('/daily-slots')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The available slots have been successfully retrieved.',
    type: [GetAllSlotsResponse],
  })
  async getDailySlots(@Request() req) {
    if (req.user.role !== 'DOCTOR') throw new ForbiddenException('Access denied');
    return this.doctorsService.getDailySlots(req.user.userId);
  }

  @Get('appointments')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The appointments have been successfully retrieved.',
  })
  async getAppointments(@Request() req) {
    if (req.user.role !== 'DOCTOR') throw new ForbiddenException('Access denied');
    return this.doctorsService.getAppointments(req.user.userId);
  }

  @Patch('appointments/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The appointment has been successfully updated.',
  })
  async updateAppointmentStatus(@Request() req , @Body() body: ModifyApointmentDto) {
    if (req.user.role !== 'DOCTOR') throw new ForbiddenException('Access denied');
    return this.doctorsService.modifyAppointment(req.user.userId, body);
  }
}