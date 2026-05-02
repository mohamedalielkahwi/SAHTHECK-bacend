import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { DoctorsService } from './doctors.service';
import { getAllPatientsResponse } from './response/getAllPatient';
import { GetFormeResponse } from './response/getForme';
import { createPosteDto } from './DTO/createPosteDto';
import { CreateDailySlotsDto } from './DTO/createDailySlotsDto';
import { GetAllSlotsResponse } from './response/getAllSlots';
import { ModifyApointmentDto } from './DTO/ModifyApointmentDto';
import { UpdateDailySlotsDto } from './DTO/updateDailySlotsDto';
import { CreateMedicalDocumentDto } from './DTO/createMedicalDocumendDto';
import { CreatePatientSessionDto } from './DTO/CreatePatientSessionDto';
import { CreateExamenCliniqueDto } from './DTO/CreateExamenCliniqueDto';
import { CreateExamenComplementaireDto } from './DTO/CreateExamenComplementaireDto';
import { CreateDiagnosticDto } from './DTO/CreateDiagnosticDto';
import { CreateConduiteATenirDto } from './DTO/CreateConduiteATenirDto';
import { CreateBilanKinesitherapiqueDto } from './DTO/CreateBilanKinesitherapiqueDto';
import { CreateProtocoleReeducationDto } from './DTO/CreateProtocoleReeducationDto';
import { CreateResultatPhysiotherapieDto } from './DTO/CreateResultatPhysiotherapieDto';

@Controller('doctors')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get('/get-patients')
  @ApiResponse({ status: 200, type: getAllPatientsResponse })
  async getPatients(@Request() req) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.getPatients(req.user.userId);
  }

  @Get('/get-forms')
  @ApiResponse({ status: 200, type: GetFormeResponse })
  async getForms(@Request() req) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.getForms(req.user.userId);
  }

  @Get('/my_posts')
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully.' })
  async getMyPosts(@Request() req) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.getMyPosts(req.user.userId);
  }

  @Post('/my_posts')
  @ApiResponse({ status: 201, description: 'Post created successfully.' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for videos
      fileFilter: (req, file, cb) => {
        if (
          !file.mimetype.startsWith('image/') &&
          !file.mimetype.startsWith('video/')
        ) {
          return cb(new Error('Only image and video files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
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
    @UploadedFile() file?: any,
  ) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.createPost(
      req.user.userId,
      createPosteDto,
      file,
    );
  }

  @Post('/daily-slots')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The daily slots have been successfully created.',
  })
  async createADailySlots(
    @Request() req,
    @Body() createDailySlotsDto: CreateDailySlotsDto,
  ) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.createADailySlots(
      req.user.userId,
      createDailySlotsDto,
    );
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
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.getDailySlots(req.user.userId);
  }

  @Patch('daily-slots/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The daily slot has been successfully updated.',
  })
  async updateDailySlots(@Request() req, @Body() body: UpdateDailySlotsDto) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.updateDailySlots(
      req.user.userId,
      body,
      req.params.id,
    );
  }

  @Delete('daily-slots/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The daily slot has been successfully deleted.',
  })
  async deleteDailySlots(@Request() req) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.deleteDailySlots(req.user.userId, req.params.id);
  }

  @Get('appointments')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The appointments have been successfully retrieved.',
  })
  async getAppointments(@Request() req) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.getAppointments(req.user.userId);
  }

  @Patch('appointments/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The appointment has been successfully updated.',
  })
  async updateAppointmentStatus(
    @Request() req,
    @Body() body: ModifyApointmentDto,
  ) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.modifyAppointment(req.user.userId, body);
  }

  @Post('/documents_medical/:patientId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The medical document has been successfully added.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async addDocument(
    @Request() req,
    @Param('patientId') patientId: string,
    @UploadedFile() file: any,
    @Body() body: CreateMedicalDocumentDto,
  ) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.addDocument(
      req.user.userId,
      patientId,
      file,
      body,
    );
  }

  @Get('/documents_medical/:patientId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The medical documents have been successfully retrieved.',
  })
  async getDocuments(@Request() req, @Param('patientId') patientId: string) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.getDocuments(req.user.userId, patientId);
  }

  // ─── PATIENT SESSIONS ──────────────────────────────────────

  @Post('/patients/:patientId/sessions')
  @ApiResponse({
    status: 201,
    description: 'Patient session created successfully.',
  })
  async createPatientSession(
    @Request() req,
    @Param('patientId') patientId: string,
    @Body() dto: CreatePatientSessionDto,
  ) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.createPatientSession(
      req.user.userId,
      patientId,
      dto,
    );
  }

  @Get('/patients/:patientId/sessions')
  @ApiResponse({
    status: 200,
    description: 'Patient sessions retrieved successfully.',
  })
  async getPatientSessions(
    @Request() req,
    @Param('patientId') patientId: string,
  ) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.getPatientSessions(req.user.userId, patientId);
  }

  @Get('/sessions/:sessionId')
  @ApiResponse({
    status: 200,
    description: 'Session details retrieved successfully.',
  })
  async getSessionById(@Request() req, @Param('sessionId') sessionId: string) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.getSessionById(req.user.userId, sessionId);
  }

  // ─── EXAMEN CLINIQUE ──────────────────────────────────────

  @Post('/sessions/:sessionId/examen-clinique')
  @ApiResponse({
    status: 201,
    description: 'Examen clinique created/updated successfully.',
  })
  async createExamenClinique(
    @Request() req,
    @Param('sessionId') sessionId: string,
    @Body() dto: CreateExamenCliniqueDto,
  ) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.createExamenClinique(
      req.user.userId,
      sessionId,
      dto,
    );
  }

  // ─── EXAMEN COMPLEMENTAIRE ────────────────────────────────

  @Post('/sessions/:sessionId/examen-complementaire')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for medical documents
      fileFilter: (req, file, cb) => {
        if (
          !file.mimetype.startsWith('image/') &&
          file.mimetype !== 'application/pdf'
        ) {
          return cb(new Error('Only image files and PDFs are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: [
            'radiographie',
            'echographie',
            'IRM',
            'arthroscanner',
            'bilanBiologique',
            'autre',
          ],
        },
        description: { type: 'string' },
        resultat: { type: 'string' },
        date: { type: 'string', format: 'date-time' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Examen complementaire created successfully.',
  })
  async createExamenComplementaire(
    @Request() req,
    @Param('sessionId') sessionId: string,
    @Body() dto: CreateExamenComplementaireDto,
    @UploadedFile() file?: any,
  ) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.createExamenComplementaire(
      req.user.userId,
      sessionId,
      dto,
      file,
    );
  }

  @Delete('/examen-complementaire/:id')
  @ApiResponse({
    status: 200,
    description: 'Examen complementaire deleted successfully.',
  })
  async deleteExamenComplementaire(@Request() req, @Param('id') id: string) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.deleteExamenComplementaire(req.user.userId, id);
  }

  // ─── DIAGNOSTIC ───────────────────────────────────────────

  @Post('/sessions/:sessionId/diagnostic')
  @ApiResponse({
    status: 201,
    description: 'Diagnostic created/updated successfully.',
  })
  async createDiagnostic(
    @Request() req,
    @Param('sessionId') sessionId: string,
    @Body() dto: CreateDiagnosticDto,
  ) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.createDiagnostic(
      req.user.userId,
      sessionId,
      dto,
    );
  }

  // ─── CONDUITE A TENIR ─────────────────────────────────────

  @Post('/sessions/:sessionId/conduite-a-tenir')
  @ApiResponse({
    status: 201,
    description: 'Conduite a tenir created/updated successfully.',
  })
  async createConduiteATenir(
    @Request() req,
    @Param('sessionId') sessionId: string,
    @Body() dto: CreateConduiteATenirDto,
  ) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.createConduiteATenir(
      req.user.userId,
      sessionId,
      dto,
    );
  }

  // ─── PHYSIOTHERAPIE ───────────────────────────────────────

  @Post('/sessions/:sessionId/physiotherapie/bilan')
  @ApiResponse({
    status: 201,
    description: 'Bilan kinesitherapique created/updated successfully.',
  })
  async createBilanKinesitherapique(
    @Request() req,
    @Param('sessionId') sessionId: string,
    @Body() dto: CreateBilanKinesitherapiqueDto,
  ) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.createBilanKinesitherapique(
      req.user.userId,
      sessionId,
      dto,
    );
  }

  @Post('/sessions/:sessionId/physiotherapie/protocole')
  @ApiResponse({
    status: 201,
    description: 'Protocole reeducation created/updated successfully.',
  })
  async createProtocoleReeducation(
    @Request() req,
    @Param('sessionId') sessionId: string,
    @Body() dto: CreateProtocoleReeducationDto,
  ) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.createProtocoleReeducation(
      req.user.userId,
      sessionId,
      dto,
    );
  }

  @Post('/sessions/:sessionId/physiotherapie/resultat')
  @ApiResponse({
    status: 201,
    description: 'Resultat physiotherapie created/updated successfully.',
  })
  async createResultatPhysiotherapie(
    @Request() req,
    @Param('sessionId') sessionId: string,
    @Body() dto: CreateResultatPhysiotherapieDto,
  ) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.createResultatPhysiotherapie(
      req.user.userId,
      sessionId,
      dto,
    );
  }

  // ─── EVOLUTION CHART DATA ─────────────────────────────────

  @Get('/patients/:patientId/evolution')
  @ApiResponse({
    status: 200,
    description: 'Patient evolution data retrieved successfully.',
  })
  async getPatientEvolution(
    @Request() req,
    @Param('patientId') patientId: string,
  ) {
    if (req.user.role !== 'DOCTOR')
      throw new ForbiddenException('Access denied');
    return this.doctorsService.getPatientEvolution(req.user.userId, patientId);
  }
}
