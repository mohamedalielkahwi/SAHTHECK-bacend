import {
  Body, Controller, ForbiddenException, Get,
  Post, Request, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { DoctorsService } from './doctors.service';
import { getAllPatientsResponse } from './response/getAllPatient';
import { GetFormeResponse } from './response/getForme';
import { createPosteDto } from './DTO/createPosteDto';

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
}