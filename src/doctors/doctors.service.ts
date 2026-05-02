import {
  ConflictException,
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPosteDto } from './DTO/createPosteDto';
import { MinioService } from 'src/minio/minio.service';
import { CreateDailySlotsDto } from './DTO/createDailySlotsDto';
import { ModifyApointmentDto } from './DTO/ModifyApointmentDto';
import { UpdateDailySlotsDto } from './DTO/updateDailySlotsDto';
import { CreateMedicalDocumentDto } from './DTO/createMedicalDocumendDto';
import { ChatService } from 'src/chat/chat.service';
import { Express } from 'express';
import { CreatePatientSessionDto } from './DTO/CreatePatientSessionDto';
import { CreateExamenCliniqueDto } from './DTO/CreateExamenCliniqueDto';
import { CreateExamenComplementaireDto } from './DTO/CreateExamenComplementaireDto';
import { CreateDiagnosticDto } from './DTO/CreateDiagnosticDto';
import { CreateConduiteATenirDto } from './DTO/CreateConduiteATenirDto';
import { CreateBilanKinesitherapiqueDto } from './DTO/CreateBilanKinesitherapiqueDto';
import { CreateProtocoleReeducationDto } from './DTO/CreateProtocoleReeducationDto';
import { CreateResultatPhysiotherapieDto } from './DTO/CreateResultatPhysiotherapieDto';

@Injectable()
export class DoctorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
    private readonly chatService: ChatService,
  ) {}
  async getPatients(doctorId: string) {
    const patients = await this.prisma.user.findMany({
      where: {
        role: 'PATIENT',
        patient: {
          appointments: {
            some: {
              specialistId: doctorId,
              status: 'COMPLETED',
            },
          },
        },
      },
      select: {
        userId: true,
        fullName: true,
        email: true,
        gender: true,
        phone: true,
        patient: {
          select: {
            age: true,
            height: true,
            weight: true,
            appointments: {
              where: {
                status: 'COMPLETED',
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
              select: {
                reason: true,
                AvailableSlot: {
                  select: {
                    date: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const count = await this.prisma.user.count({
      where: {
        role: 'PATIENT',
        patient: {
          appointments: {
            some: {
              specialistId: doctorId,
              status: 'COMPLETED',
            },
          },
        },
      },
    });
    return { patients, count };
  }

  async getForms(doctorId: string) {
    const patientsCount = await this.prisma.user.count({
      where: {
        role: 'PATIENT',
        patient: {
          appointments: {
            some: {
              specialistId: doctorId,
            },
          },
        },
      },
    });

    const now = new Date();

    const appointmentsCount = await this.prisma.appointment.count({
      where: {
        specialistId: doctorId,
        OR: [
          {
            // Case 1: The date is strictly in the future (tomorrow or later)
            AvailableSlot: {
              date: { gt: now },
              isBooked: true,
            },
          },
          {
            // Case 2: The date is today, so we check if the time is still to come
            AvailableSlot: {
              date: now,
              startTime: { gt: now },
              isBooked: true,
            },
          },
        ],
      },
    });
    const unreadedcount = await this.chatService.getUnreadCount(doctorId);
    return { patientsCount, appointmentsCount, unreadedcount };
  }

  async getMyPosts(doctorId: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        publishedById: doctorId,
      },
      select: {
        postId: true,
        title: true,
        description: true,
        createdAt: true,
        type: true,
        url: true,
        isPublished: true,
      },
    });
    const count = await this.prisma.post.count({
      where: {
        publishedById: doctorId,
      },
    });
    return { posts, count };
  }

  async createPost(doctorId: string, dto: createPosteDto, file?: any) {
    let fileUrl: string | null = null;

    if (file) {
      // folder structure: posts/{doctorId}/filename
      // MinioService.uploadFile will create folders automatically
      // since MinIO uses flat key structure with / as separator
      const folder = `posts/${doctorId}`;
      fileUrl = await this.minioService.uploadFile(file, folder);
    }

    const post = await this.prisma.post.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type as any,
        url: fileUrl ?? '',
        publishedById: doctorId,
        isPublished: false,
      },
      select: {
        postId: true,
        title: true,
        description: true,
        type: true,
        url: true,
        isPublished: true,
        createdAt: true,
      },
    });

    return post;
  }

  async createADailySlots(
    userId: string,
    createDailySlotsDto: CreateDailySlotsDto,
  ) {
    let { date, startTime, endTime, place } = createDailySlotsDto;
    const user = await this.prisma.user.findFirst({
      where: { userId },
    });
    if (!user) throw new ConflictException('User not found');

    // Ensure date is a proper Date object set to midnight
    const dateObject = new Date(date);
    dateObject.setHours(0, 0, 0, 0);

    // Convert startTime and endTime to Date objects for the query
    const startTimeDate = new Date(dateObject);
    startTimeDate.setHours(startTime, 0, 0, 0);
    const endTimeDate = new Date(dateObject);
    endTimeDate.setHours(endTime, 0, 0, 0);

    const existingSlots = await this.prisma.availabeSlot.findMany({
      where: {
        specialistId: userId,
        date: dateObject,
        // Any overlap with the requested range
        startTime: {
          lt: endTimeDate,
        },
        endTime: {
          gt: startTimeDate,
        },
      },
      select: {
        startTime: true,
      },
    });

    const existingStartTimes = new Set(
      existingSlots.map((slot) => slot.startTime.getTime()),
    );
    const slots: {
      specialistId: string;
      startTime: Date;
      endTime: Date;
      date: Date;
      place: string;
    }[] = [];
    const slotDuration = 1;
    for (let hour = startTime; hour < endTime; hour++) {
      const slotStart = new Date(dateObject);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(dateObject);
      slotEnd.setHours(hour + slotDuration, 0, 0, 0);

      if (existingStartTimes.has(slotStart.getTime())) {
        continue;
      }

      slots.push({
        specialistId: userId,
        startTime: slotStart,
        endTime: slotEnd,
        date: dateObject,
        place: place,
      });
    }

    if (slots.length === 0) {
      return { count: 0 };
    }

    return this.prisma.availabeSlot.createMany({
      data: slots,
    });
  }

  async getDailySlots(userId: string) {
    const now = new Date();
    const slots = await this.prisma.availabeSlot.findMany({
      where: {
        specialistId: userId,
        date: { gte: now },
        isBooked: false,
      },
      select: {
        availabilityId: true,
        date: true,
        startTime: true,
        endTime: true,
        isBooked: true,
        place: true,
      },
    });
    return slots;
  }

  async updateDailySlots(
    userId: string,
    body: UpdateDailySlotsDto,
    id: string,
  ) {
    const { date, startTime, endTime, place, isBooked } = body;
    const dateObject = new Date(date);
    dateObject.setHours(0, 0, 0, 0);
    const startTimeDate = new Date(dateObject);
    startTimeDate.setHours(startTime, 0, 0, 0);
    const endTimeDate = new Date(dateObject);
    endTimeDate.setHours(endTime, 0, 0, 0);
    const slot = await this.prisma.availabeSlot.findFirst({
      where: {
        specialistId: userId,
        date: dateObject,
        startTime: startTimeDate,
        endTime: endTimeDate,
        isBooked: isBooked,
      },
    });
    console.log(slot);
    if (slot)
      throw new ConflictException(
        'Slot already exists with the same date and time',
      );
    return this.prisma.availabeSlot.update({
      where: {
        availabilityId: id,
        specialistId: userId,
      },
      data: {
        date: dateObject,
        startTime: startTimeDate,
        endTime: endTimeDate,
        place,
        isBooked,
      },
    });
  }

  async deleteDailySlots(userId: string, id: string) {
    const slot = await this.prisma.availabeSlot.findFirst({
      where: {
        availabilityId: id,
        specialistId: userId,
      },
    });
    if (!slot) throw new ConflictException('Slot or user not found');
    return this.prisma.availabeSlot.delete({
      where: {
        availabilityId: id,
        specialistId: userId,
      },
    });
  }

  async getAppointments(doctorId: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        specialistId: doctorId,
      },
      select: {
        appointmentId: true,
        status: true,
        reason: true,
        AvailableSlot: {
          select: {
            date: true,
            startTime: true,
            endTime: true,
            place: true,
          },
        },
        patient: {
          select: {
            user: {
              select: {
                fullName: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });
    return appointments;
  }

  async modifyAppointment(doctorId: string, body: ModifyApointmentDto) {
    const { appointmentId, status } = body;
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        appointmentId,
        specialistId: doctorId,
      },
    });
    if (!appointment) throw new ConflictException('Appointment not found');
    await this.prisma.appointment.update({
      where: { appointmentId },
      data: { status: status as any },
    });
    if (status === 'REJECTED') {
      await this.prisma.availabeSlot.update({
        where: { availabilityId: appointment.availabilityId },
        data: { isBooked: false },
      });
    }
    if (status === 'ACCEPTED') {
      const conversation = await this.chatService.createConversation(
        appointment.patientId!,
        appointment.specialistId,
        appointment.appointmentId,
      );
      console.log('Conversation created ', conversation);
    }
    return { message: 'Appointment modified successfully', status };
  }

  async addDocument(
    doctorId: string,
    patientId: string,
    file: any,
    body: CreateMedicalDocumentDto,
  ) {
    const patient = await this.prisma.user.findFirst({
      where: {
        userId: patientId,
      },
    });
    if (!patient) throw new ConflictException('Patient not found');

    // File upload only - no database storage since medicalDocument doesn't exist
    const folder = `medical-documents/${patientId}`;
    const fileUrl = await this.minioService.uploadFile(file, folder);

    return {
      message: 'Document uploaded successfully',
      fileUrl: fileUrl,
    };
  }

  async getDocuments(doctorId: string, patientId: string) {
    const patient = await this.prisma.user.findFirst({
      where: {
        userId: patientId,
      },
    });
    if (!patient) throw new ConflictException('Patient not found');

    // Return empty array since medicalDocument doesn't exist in schema
    // In a real scenario, you would query medical documents from a proper table
    return [];
  }

  // ─── PATIENT SESSIONS ──────────────────────────────────────

  private async verifyPatientBelongsToDoctor(
    doctorId: string,
    patientId: string,
  ): Promise<void> {
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        specialistId: doctorId,
        patientId: patientId,
      },
    });
    if (!appointment) {
      throw new ForbiddenException(
        'Patient does not belong to this doctor or has no appointments',
      );
    }
  }

  async createPatientSession(
    doctorId: string,
    patientId: string,
    dto: CreatePatientSessionDto,
  ) {
    await this.verifyPatientBelongsToDoctor(doctorId, patientId);

    const sessionDate = dto.sessionDate
      ? new Date(dto.sessionDate)
      : new Date();

    const session = await this.prisma.patientSession.create({
      data: {
        patientId,
        specialistId: doctorId,
        sessionDate,
        notes: dto.notes,
      },
      include: {
        examenClinique: true,
        examenComplementaire: true,
        diagnostic: true,
        conduiteATenir: true,
        physiotherapie: {
          include: {
            bilanKinesitherapique: true,
            protocoleReeducation: true,
            resultat: true,
          },
        },
      },
    });

    return session;
  }

  async getPatientSessions(doctorId: string, patientId: string) {
    await this.verifyPatientBelongsToDoctor(doctorId, patientId);

    return this.prisma.patientSession.findMany({
      where: {
        patientId,
        specialistId: doctorId,
      },
      include: {
        examenClinique: true,
        examenComplementaire: true,
        diagnostic: true,
        conduiteATenir: true,
        physiotherapie: {
          include: {
            bilanKinesitherapique: true,
            protocoleReeducation: true,
            resultat: true,
          },
        },
      },
      orderBy: {
        sessionDate: 'desc',
      },
    });
  }

  async getSessionById(doctorId: string, sessionId: string) {
    const session = await this.prisma.patientSession.findUnique({
      where: { sessionId },
      include: {
        examenClinique: true,
        examenComplementaire: true,
        diagnostic: true,
        conduiteATenir: true,
        physiotherapie: {
          include: {
            bilanKinesitherapique: true,
            protocoleReeducation: true,
            resultat: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.specialistId !== doctorId) {
      throw new ForbiddenException('You do not have access to this session');
    }

    return session;
  }

  // ─── EXAMEN CLINIQUE ──────────────────────────────────────

  async createExamenClinique(
    doctorId: string,
    sessionId: string,
    dto: CreateExamenCliniqueDto,
  ) {
    const session = await this.getSessionById(doctorId, sessionId);

    const serializeValue = (value: unknown) => {
      if (!value) return null;
      return typeof value === 'string' ? value : JSON.stringify(value);
    };

    const examenData = {
      ...dto,
      mobiliteActive: serializeValue(dto.mobiliteActive),
      mobilitePassive: serializeValue(dto.mobilitePassive),
      testConflits: serializeValue(dto.testConflits),
      testsTendineux: serializeValue(dto.testsTendineux),
    };

    const examen = await this.prisma.examenClinique.upsert({
      where: { sessionId },
      update: examenData,
      create: {
        sessionId,
        ...examenData,
      },
    });

    return examen;
  }

  // ─── EXAMEN COMPLEMENTAIRE ────────────────────────────────

  async createExamenComplementaire(
    doctorId: string,
    sessionId: string,
    dto: CreateExamenComplementaireDto,
    file?: any,
  ) {
    const session = await this.getSessionById(doctorId, sessionId);

    let objectName: string | null = null;
    let contentType: string | null = null;
    if (file) {
      const folder = `medical-documents/${session.patientId}`;
      objectName = await this.minioService.uploadPrivateFile(file, folder);
      contentType = file.mimetype;
    }

    const examDate = dto.date ? new Date(dto.date) : new Date();

    const examen = await this.prisma.examenComplementaire.create({
      data: {
        sessionId,
        type: dto.type as any,
        description: dto.description,
        resultat: dto.resultat,
        // store object key only (do not expose bucket path)
        fileUrl: objectName,
        date: examDate,
      },
    });

    // If a file was uploaded, generate a short-lived presigned URL (default 10 minutes)
    if (objectName) {
      const expirySeconds = 600; // 10 minutes (between 5 and 15)
      const presigned = await this.minioService.getPresignedUrlByObjectName(
        objectName,
        expirySeconds,
      );

      // Return the examen plus a downloadUrl (presigned). Frontend should use contentType
      return {
        ...examen,
        downloadUrl: presigned,
        contentType,
        expiresIn: expirySeconds,
      };
    }

    return examen;
  }

  async deleteExamenComplementaire(doctorId: string, id: string) {
    const examen = await this.prisma.examenComplementaire.findUnique({
      where: { id },
      include: { session: true },
    });

    if (!examen) {
      throw new NotFoundException('Examen complementaire not found');
    }

    if (examen.session.specialistId !== doctorId) {
      throw new ForbiddenException('You do not have access to this examen');
    }

    // Delete file from MinIO if exists. We store object name in DB for private files.
    if (examen.fileUrl) {
      try {
        const bucket = (this.minioService as any).bucket;
        let objectName = examen.fileUrl;
        if (typeof objectName === 'string' && objectName.startsWith('http')) {
          // previous records may contain full public URL; extract object name
          const parts = objectName.split(`/${bucket}/`);
          objectName = parts[1] ?? objectName;
        }

        await this.minioService.removeObjectByName(objectName);
      } catch (error) {
        console.error('Error deleting file from MinIO', error);
      }
    }

    return this.prisma.examenComplementaire.delete({
      where: { id },
    });
  }

  // ─── DIAGNOSTIC ───────────────────────────────────────────

  async createDiagnostic(
    doctorId: string,
    sessionId: string,
    dto: CreateDiagnosticDto,
  ) {
    const session = await this.getSessionById(doctorId, sessionId);

    const diagnostic = await this.prisma.diagnostic.upsert({
      where: { sessionId },
      update: {
        typeEpaule: dto.typeEpaule as any,
        diagnostic: dto.diagnostic,
        diagnosticDiff: dto.diagnosticDiff,
        severite: dto.severite,
        observations: dto.observations,
      },
      create: {
        sessionId,
        typeEpaule: dto.typeEpaule as any,
        diagnostic: dto.diagnostic,
        diagnosticDiff: dto.diagnosticDiff,
        severite: dto.severite,
        observations: dto.observations,
      },
    });

    return diagnostic;
  }

  // ─── CONDUITE A TENIR ─────────────────────────────────────

  async createConduiteATenir(
    doctorId: string,
    sessionId: string,
    dto: CreateConduiteATenirDto,
  ) {
    const session = await this.getSessionById(doctorId, sessionId);

    const prochainRDV = dto.prochainRDV ? new Date(dto.prochainRDV) : null;

    const conduite = await this.prisma.conduiteATenir.upsert({
      where: { sessionId },
      update: {
        antalgiques: dto.antalgiques,
        antiInflammatoires: dto.antiInflammatoires,
        myorelaxants: dto.myorelaxants,
        corticoides: dto.corticoides,
        autresMedicaments: dto.autresMedicaments,
        infiltration: dto.infiltration ?? false,
        infiltrationDetail: dto.infiltrationDetail,
        ondesDeChoc: dto.ondesDeChoc ?? false,
        arthroDistension: dto.arthroDistension ?? false,
        chirurgie: dto.chirurgie ?? false,
        typeChirurgie: dto.typeChirurgie,
        reposRelatif: dto.reposRelatif ?? false,
        recommandations: dto.recommandations,
        prochainRDV,
        objectifs: dto.objectifs,
      },
      create: {
        sessionId,
        antalgiques: dto.antalgiques,
        antiInflammatoires: dto.antiInflammatoires,
        myorelaxants: dto.myorelaxants,
        corticoides: dto.corticoides,
        autresMedicaments: dto.autresMedicaments,
        infiltration: dto.infiltration ?? false,
        infiltrationDetail: dto.infiltrationDetail,
        ondesDeChoc: dto.ondesDeChoc ?? false,
        arthroDistension: dto.arthroDistension ?? false,
        chirurgie: dto.chirurgie ?? false,
        typeChirurgie: dto.typeChirurgie,
        reposRelatif: dto.reposRelatif ?? false,
        recommandations: dto.recommandations,
        prochainRDV,
        objectifs: dto.objectifs,
      },
    });

    return conduite;
  }

  // ─── PHYSIOTHERAPIE ───────────────────────────────────────

  private async getOrCreatePhysiotherapie(sessionId: string) {
    let physio = await this.prisma.physiotherapie.findUnique({
      where: { sessionId },
    });

    if (!physio) {
      physio = await this.prisma.physiotherapie.create({
        data: { sessionId },
      });
    }

    return physio;
  }

  async createBilanKinesitherapique(
    doctorId: string,
    sessionId: string,
    dto: CreateBilanKinesitherapiqueDto,
  ) {
    const session = await this.getSessionById(doctorId, sessionId);
    const physio = await this.getOrCreatePhysiotherapie(sessionId);

    // Parse JSON strings for scores
    const parseJson = (value: string | undefined) => {
      if (!value) return null;
      try {
        return typeof value === 'string' ? JSON.parse(value) : value;
      } catch {
        return null;
      }
    };

    const bilan = await this.prisma.bilanKinesitherapique.upsert({
      where: { physiotherapieId: physio.id },
      update: {
        plainte: dto.plainte,
        historique: dto.historique,
        intensiteEVA: dto.intensiteEVA,
        constantScore: parseJson(dto.constantScore),
        quickDashScore: parseJson(dto.quickDashScore),
        dashArabeScore: parseJson(dto.dashArabeScore),
        antepulsionActive: dto.antepulsionActive,
        abductionActive: dto.abductionActive,
        retractionActive: dto.retractionActive,
        rotationExterneActive: dto.rotationExterneActive,
        rotationInterneActive: dto.rotationInterneActive,
        antepulsionPassive: dto.antepulsionPassive,
        abductionPassive: dto.abductionPassive,
        retractionPassive: dto.retractionPassive,
        rotationExternePassive: dto.rotationExternePassive,
        rotationInternePassive: dto.rotationInternePassive,
        deltoideTesting: dto.deltoideTesting,
        susEpineuxTesting: dto.susEpineuxTesting,
        infraEpineuxTesting: dto.infraEpineuxTesting,
        subScapulaireTesting: dto.subScapulaireTesting,
        testJobe: dto.testJobe,
        testPatte: dto.testPatte,
        testGerber: dto.testGerber,
        testNeer: dto.testNeer,
        testHawkins: dto.testHawkins,
        mainBouche: dto.mainBouche,
        mainTete: dto.mainTete,
        mainNuque: dto.mainNuque,
        mainDos: dto.mainDos,
        observations: dto.observations,
      },
      create: {
        physiotherapieId: physio.id,
        plainte: dto.plainte,
        historique: dto.historique,
        intensiteEVA: dto.intensiteEVA,
        constantScore: parseJson(dto.constantScore),
        quickDashScore: parseJson(dto.quickDashScore),
        dashArabeScore: parseJson(dto.dashArabeScore),
        antepulsionActive: dto.antepulsionActive,
        abductionActive: dto.abductionActive,
        retractionActive: dto.retractionActive,
        rotationExterneActive: dto.rotationExterneActive,
        rotationInterneActive: dto.rotationInterneActive,
        antepulsionPassive: dto.antepulsionPassive,
        abductionPassive: dto.abductionPassive,
        retractionPassive: dto.retractionPassive,
        rotationExternePassive: dto.rotationExternePassive,
        rotationInternePassive: dto.rotationInternePassive,
        deltoideTesting: dto.deltoideTesting,
        susEpineuxTesting: dto.susEpineuxTesting,
        infraEpineuxTesting: dto.infraEpineuxTesting,
        subScapulaireTesting: dto.subScapulaireTesting,
        testJobe: dto.testJobe,
        testPatte: dto.testPatte,
        testGerber: dto.testGerber,
        testNeer: dto.testNeer,
        testHawkins: dto.testHawkins,
        mainBouche: dto.mainBouche,
        mainTete: dto.mainTete,
        mainNuque: dto.mainNuque,
        mainDos: dto.mainDos,
        observations: dto.observations,
      },
    });

    return bilan;
  }

  async createProtocoleReeducation(
    doctorId: string,
    sessionId: string,
    dto: CreateProtocoleReeducationDto,
  ) {
    const session = await this.getSessionById(doctorId, sessionId);
    const physio = await this.getOrCreatePhysiotherapie(sessionId);

    const protocole = await this.prisma.protocoleReeducation.upsert({
      where: { physiotherapieId: physio.id },
      update: {
        objectifsCourt: dto.objectifsCourt,
        objectifsLong: dto.objectifsLong,
        physiotherapieAntalgique: dto.physiotherapieAntalgique ?? false,
        typesPhysio: dto.typesPhysio,
        massage: dto.massage ?? false,
        massageDetail: dto.massageDetail,
        balnéotherapie: dto.balnéotherapie ?? false,
        mobilisationsPassives: dto.mobilisationsPassives ?? false,
        mobilisationsActives: dto.mobilisationsActives ?? false,
        renforcement: dto.renforcement ?? false,
        proprioception: dto.proprioception ?? false,
        exercicesDetail: dto.exercicesDetail,
        exerciceIds: dto.exerciceIds ?? [],
        seancesParSemaine: dto.seancesParSemaine,
        dureeSemaines: dto.dureeSemaines,
        orthese: dto.orthese ?? false,
        typeOrthese: dto.typeOrthese,
        observations: dto.observations,
      },
      create: {
        physiotherapieId: physio.id,
        objectifsCourt: dto.objectifsCourt,
        objectifsLong: dto.objectifsLong,
        physiotherapieAntalgique: dto.physiotherapieAntalgique ?? false,
        typesPhysio: dto.typesPhysio,
        massage: dto.massage ?? false,
        massageDetail: dto.massageDetail,
        balnéotherapie: dto.balnéotherapie ?? false,
        mobilisationsPassives: dto.mobilisationsPassives ?? false,
        mobilisationsActives: dto.mobilisationsActives ?? false,
        renforcement: dto.renforcement ?? false,
        proprioception: dto.proprioception ?? false,
        exercicesDetail: dto.exercicesDetail,
        exerciceIds: dto.exerciceIds ?? [],
        seancesParSemaine: dto.seancesParSemaine,
        dureeSemaines: dto.dureeSemaines,
        orthese: dto.orthese ?? false,
        typeOrthese: dto.typeOrthese,
        observations: dto.observations,
      },
    });

    return protocole;
  }

  async createResultatPhysiotherapie(
    doctorId: string,
    sessionId: string,
    dto: CreateResultatPhysiotherapieDto,
  ) {
    const session = await this.getSessionById(doctorId, sessionId);
    const physio = await this.getOrCreatePhysiotherapie(sessionId);

    // Parse JSON strings for scores
    const parseJson = (value: string | undefined) => {
      if (!value) return null;
      try {
        return typeof value === 'string' ? JSON.parse(value) : value;
      } catch {
        return null;
      }
    };

    const resultat = await this.prisma.resultatPhysiotherapie.upsert({
      where: { physiotherapieId: physio.id },
      update: {
        constantScoreFinal: parseJson(dto.constantScoreFinal),
        quickDashScoreFinal: parseJson(dto.quickDashScoreFinal),
        evaFinal: dto.evaFinal,
        evolutionDouleur: dto.evolutionDouleur as any,
        evolutionMobilite: dto.evolutionMobilite as any,
        evolutionForce: dto.evolutionForce as any,
        evolutionFonction: dto.evolutionFonction as any,
        antepulsionFinal: dto.antepulsionFinal,
        abductionFinal: dto.abductionFinal,
        rotationExterneFinal: dto.rotationExterneFinal,
        rotationInterneFinal: dto.rotationInterneFinal,
        objectifsAtteints: dto.objectifsAtteints ?? false,
        conclusionKine: dto.conclusionKine,
        suitesDonnees: dto.suitesDonnees,
      },
      create: {
        physiotherapieId: physio.id,
        constantScoreFinal: parseJson(dto.constantScoreFinal),
        quickDashScoreFinal: parseJson(dto.quickDashScoreFinal),
        evaFinal: dto.evaFinal,
        evolutionDouleur: dto.evolutionDouleur as any,
        evolutionMobilite: dto.evolutionMobilite as any,
        evolutionForce: dto.evolutionForce as any,
        evolutionFonction: dto.evolutionFonction as any,
        antepulsionFinal: dto.antepulsionFinal,
        abductionFinal: dto.abductionFinal,
        rotationExterneFinal: dto.rotationExterneFinal,
        rotationInterneFinal: dto.rotationInterneFinal,
        objectifsAtteints: dto.objectifsAtteints ?? false,
        conclusionKine: dto.conclusionKine,
        suitesDonnees: dto.suitesDonnees,
      },
    });

    return resultat;
  }

  // ─── EVOLUTION CHART DATA ─────────────────────────────────

  async getPatientEvolution(doctorId: string, patientId: string) {
    await this.verifyPatientBelongsToDoctor(doctorId, patientId);

    const sessions = await this.prisma.patientSession.findMany({
      where: {
        patientId,
        specialistId: doctorId,
      },
      include: {
        examenClinique: {
          select: { intensiteEVA: true },
        },
        physiotherapie: {
          include: {
            bilanKinesitherapique: {
              select: {
                constantScore: true,
                quickDashScore: true,
                antepulsionActive: true,
                abductionActive: true,
              },
            },
            resultat: {
              select: {
                evaFinal: true,
                constantScoreFinal: true,
                quickDashScoreFinal: true,
                antepulsionFinal: true,
                abductionFinal: true,
              },
            },
          },
        },
      },
      orderBy: {
        sessionDate: 'asc',
      },
    });

    // Format data for charts
    const evolution = sessions.map((session) => {
      const bilan = session.physiotherapie?.bilanKinesitherapique;
      const resultat = session.physiotherapie?.resultat;
      const examen = session.examenClinique;

      // Extract numeric values from JSON objects if they exist
      const getScoreValue = (jsonObj: any, key: string) => {
        if (!jsonObj) return null;
        if (jsonObj[key] !== undefined) return jsonObj[key];
        return null;
      };

      return {
        sessionDate: session.sessionDate,
        evaScore: resultat?.evaFinal ?? examen?.intensiteEVA ?? null,
        constantTotal:
          getScoreValue(resultat?.constantScoreFinal, 'total') ??
          getScoreValue(bilan?.constantScore, 'total') ??
          null,
        quickDashScore:
          getScoreValue(resultat?.quickDashScoreFinal, 'score') ??
          getScoreValue(bilan?.quickDashScore, 'score') ??
          null,
        antepulsionActive:
          resultat?.antepulsionFinal ?? bilan?.antepulsionActive ?? null,
        abductionActive:
          resultat?.abductionFinal ?? bilan?.abductionActive ?? null,
      };
    });

    return evolution;
  }
}
