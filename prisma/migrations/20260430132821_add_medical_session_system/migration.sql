-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PATIENT', 'DOCTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "OtpType" AS ENUM ('EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'TWO_FACTOR');

-- CreateEnum
CREATE TYPE "Security" AS ENUM ('MFA', 'SFA');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('pdf', 'image');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SCHEDULED', 'ACEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('IRM', 'scanner', 'radioStandard', 'echographie', 'bilanKene', 'protocoleDeReEducation', 'resultatsDAnalyse');

-- CreateEnum
CREATE TYPE "Title" AS ENUM ('examenClinique', 'examenComplementaire', 'conduitAtenir', 'physiotherapie', 'Diagnostic');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('ARTICLE', 'VIDEO', 'IMAGE');

-- CreateEnum
CREATE TYPE "ExamenComplementaireType" AS ENUM ('radiographie', 'echographie', 'IRM', 'arthroscanner', 'bilanBiologique', 'autre');

-- CreateEnum
CREATE TYPE "TypeEpaule" AS ENUM ('douloureuse_simple', 'hyperalgique', 'pseudo_paralytique', 'bloquee');

-- CreateEnum
CREATE TYPE "Evolution" AS ENUM ('amelioration', 'stable', 'aggravation');

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "OtpType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "phone" TEXT,
    "imageUrl" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "gender" "Gender",
    "role" "Role" NOT NULL,
    "security" "Security" DEFAULT 'SFA',
    "address" TEXT,
    "isGoogleAccount" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "conversationId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "specialistId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("conversationId")
);

-- CreateTable
CREATE TABLE "Message" (
    "messageId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("messageId")
);

-- CreateTable
CREATE TABLE "Patient" (
    "userId" TEXT NOT NULL,
    "age" INTEGER,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "exerciseTolerance" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "PatientSession" (
    "sessionId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "specialistId" TEXT NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientSession_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "ExamenClinique" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "age" INTEGER,
    "sexe" TEXT,
    "profession" TEXT,
    "membreDominant" TEXT,
    "activiteSportive" TEXT,
    "couvertureSociale" TEXT,
    "antecedents" TEXT,
    "siegeDouleur" TEXT,
    "irradiation" TEXT,
    "intensiteEVA" DOUBLE PRECISION,
    "typeRythme" TEXT,
    "facteurAggravant" TEXT,
    "facteurSoulagement" TEXT,
    "debutDouleur" TEXT,
    "retentissementAVQ" BOOLEAN NOT NULL DEFAULT false,
    "retentissementPro" BOOLEAN NOT NULL DEFAULT false,
    "retentissementSommeil" BOOLEAN NOT NULL DEFAULT false,
    "inspection" TEXT,
    "mobiliteActive" TEXT,
    "mobilitePassive" TEXT,
    "testConflits" TEXT,
    "testsTendineux" TEXT,
    "palpation" TEXT,
    "examenCervical" TEXT,
    "examenNeurologique" TEXT,
    "mainBouche" BOOLEAN NOT NULL DEFAULT false,
    "mainTete" BOOLEAN NOT NULL DEFAULT false,
    "mainNuque" BOOLEAN NOT NULL DEFAULT false,
    "mainDos" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamenClinique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamenComplementaire" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" "ExamenComplementaireType" NOT NULL,
    "description" TEXT,
    "resultat" TEXT,
    "fileUrl" TEXT,
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamenComplementaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnostic" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "typeEpaule" "TypeEpaule",
    "diagnostic" TEXT NOT NULL,
    "diagnosticDiff" TEXT,
    "severite" TEXT,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Diagnostic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConduiteATenir" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "antalgiques" TEXT,
    "antiInflammatoires" TEXT,
    "myorelaxants" TEXT,
    "corticoides" TEXT,
    "autresMedicaments" TEXT,
    "infiltration" BOOLEAN NOT NULL DEFAULT false,
    "infiltrationDetail" TEXT,
    "ondesDeChoc" BOOLEAN NOT NULL DEFAULT false,
    "arthroDistension" BOOLEAN NOT NULL DEFAULT false,
    "chirurgie" BOOLEAN NOT NULL DEFAULT false,
    "typeChirurgie" TEXT,
    "reposRelatif" BOOLEAN NOT NULL DEFAULT false,
    "recommandations" TEXT,
    "prochainRDV" TIMESTAMP(3),
    "objectifs" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConduiteATenir_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Physiotherapie" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Physiotherapie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BilanKinesitherapique" (
    "id" TEXT NOT NULL,
    "physiotherapieId" TEXT NOT NULL,
    "plainte" TEXT,
    "historique" TEXT,
    "intensiteEVA" DOUBLE PRECISION,
    "constantScore" JSONB,
    "quickDashScore" JSONB,
    "dashArabeScore" JSONB,
    "antepulsionActive" DOUBLE PRECISION,
    "abductionActive" DOUBLE PRECISION,
    "retractionActive" DOUBLE PRECISION,
    "rotationExterneActive" DOUBLE PRECISION,
    "rotationInterneActive" DOUBLE PRECISION,
    "antepulsionPassive" DOUBLE PRECISION,
    "abductionPassive" DOUBLE PRECISION,
    "retractionPassive" DOUBLE PRECISION,
    "rotationExternePassive" DOUBLE PRECISION,
    "rotationInternePassive" DOUBLE PRECISION,
    "deltoideTesting" INTEGER,
    "susEpineuxTesting" INTEGER,
    "infraEpineuxTesting" INTEGER,
    "subScapulaireTesting" INTEGER,
    "testJobe" BOOLEAN,
    "testPatte" BOOLEAN,
    "testGerber" BOOLEAN,
    "testNeer" BOOLEAN,
    "testHawkins" BOOLEAN,
    "mainBouche" BOOLEAN,
    "mainTete" BOOLEAN,
    "mainNuque" BOOLEAN,
    "mainDos" BOOLEAN,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BilanKinesitherapique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProtocoleReeducation" (
    "id" TEXT NOT NULL,
    "physiotherapieId" TEXT NOT NULL,
    "objectifsCourt" TEXT,
    "objectifsLong" TEXT,
    "physiotherapieAntalgique" BOOLEAN NOT NULL DEFAULT false,
    "typesPhysio" TEXT,
    "massage" BOOLEAN NOT NULL DEFAULT false,
    "massageDetail" TEXT,
    "balnéotherapie" BOOLEAN NOT NULL DEFAULT false,
    "mobilisationsPassives" BOOLEAN NOT NULL DEFAULT false,
    "mobilisationsActives" BOOLEAN NOT NULL DEFAULT false,
    "renforcement" BOOLEAN NOT NULL DEFAULT false,
    "proprioception" BOOLEAN NOT NULL DEFAULT false,
    "exercicesDetail" TEXT,
    "exerciceIds" TEXT[],
    "seancesParSemaine" INTEGER,
    "dureeSemaines" INTEGER,
    "orthese" BOOLEAN NOT NULL DEFAULT false,
    "typeOrthese" TEXT,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProtocoleReeducation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultatPhysiotherapie" (
    "id" TEXT NOT NULL,
    "physiotherapieId" TEXT NOT NULL,
    "constantScoreFinal" JSONB,
    "quickDashScoreFinal" JSONB,
    "evaFinal" DOUBLE PRECISION,
    "evolutionDouleur" "Evolution",
    "evolutionMobilite" "Evolution",
    "evolutionForce" "Evolution",
    "evolutionFonction" "Evolution",
    "antepulsionFinal" DOUBLE PRECISION,
    "abductionFinal" DOUBLE PRECISION,
    "rotationExterneFinal" DOUBLE PRECISION,
    "rotationInterneFinal" DOUBLE PRECISION,
    "objectifsAtteints" BOOLEAN NOT NULL DEFAULT false,
    "conclusionKine" TEXT,
    "suitesDonnees" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResultatPhysiotherapie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialist" (
    "userId" TEXT NOT NULL,
    "speciality" TEXT,
    "bio" TEXT,
    "licenseNumber" TEXT NOT NULL,
    "isValidated" BOOLEAN NOT NULL DEFAULT false,
    "clinic" TEXT,
    "location" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "expertise" TEXT[],

    CONSTRAINT "Specialist_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Admin" (
    "userId" TEXT NOT NULL,
    "canModerate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Clinic" (
    "clinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("clinicId")
);

-- CreateTable
CREATE TABLE "AvailabeSlot" (
    "availabilityId" TEXT NOT NULL,
    "specialistId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "place" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AvailabeSlot_pkey" PRIMARY KEY ("availabilityId")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "appointmentId" TEXT NOT NULL,
    "patientId" TEXT,
    "specialistId" TEXT NOT NULL,
    "clinicId" TEXT,
    "availabilityId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("appointmentId")
);

-- CreateTable
CREATE TABLE "Post" (
    "postId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "PostType" NOT NULL,
    "url" TEXT,
    "publishedById" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("postId")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "exerciseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT,
    "createdById" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "assignedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("exerciseId")
);

-- CreateTable
CREATE TABLE "_ClinicToSpecialist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClinicToSpecialist_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserFavoritePosts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserFavoritePosts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_appointmentId_key" ON "Conversation"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamenClinique_sessionId_key" ON "ExamenClinique"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Diagnostic_sessionId_key" ON "Diagnostic"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ConduiteATenir_sessionId_key" ON "ConduiteATenir"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Physiotherapie_sessionId_key" ON "Physiotherapie"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "BilanKinesitherapique_physiotherapieId_key" ON "BilanKinesitherapique"("physiotherapieId");

-- CreateIndex
CREATE UNIQUE INDEX "ProtocoleReeducation_physiotherapieId_key" ON "ProtocoleReeducation"("physiotherapieId");

-- CreateIndex
CREATE UNIQUE INDEX "ResultatPhysiotherapie_physiotherapieId_key" ON "ResultatPhysiotherapie"("physiotherapieId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_availabilityId_key" ON "Appointment"("availabilityId");

-- CreateIndex
CREATE INDEX "_ClinicToSpecialist_B_index" ON "_ClinicToSpecialist"("B");

-- CreateIndex
CREATE INDEX "_UserFavoritePosts_B_index" ON "_UserFavoritePosts"("B");

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("appointmentId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("conversationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientSession" ADD CONSTRAINT "PatientSession_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientSession" ADD CONSTRAINT "PatientSession_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamenClinique" ADD CONSTRAINT "ExamenClinique_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PatientSession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamenComplementaire" ADD CONSTRAINT "ExamenComplementaire_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PatientSession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostic" ADD CONSTRAINT "Diagnostic_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PatientSession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConduiteATenir" ADD CONSTRAINT "ConduiteATenir_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PatientSession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Physiotherapie" ADD CONSTRAINT "Physiotherapie_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PatientSession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BilanKinesitherapique" ADD CONSTRAINT "BilanKinesitherapique_physiotherapieId_fkey" FOREIGN KEY ("physiotherapieId") REFERENCES "Physiotherapie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtocoleReeducation" ADD CONSTRAINT "ProtocoleReeducation_physiotherapieId_fkey" FOREIGN KEY ("physiotherapieId") REFERENCES "Physiotherapie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultatPhysiotherapie" ADD CONSTRAINT "ResultatPhysiotherapie_physiotherapieId_fkey" FOREIGN KEY ("physiotherapieId") REFERENCES "Physiotherapie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Specialist" ADD CONSTRAINT "Specialist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabeSlot" ADD CONSTRAINT "AvailabeSlot_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("clinicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "AvailabeSlot"("availabilityId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES "Specialist"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Patient"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Specialist"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClinicToSpecialist" ADD CONSTRAINT "_ClinicToSpecialist_A_fkey" FOREIGN KEY ("A") REFERENCES "Clinic"("clinicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClinicToSpecialist" ADD CONSTRAINT "_ClinicToSpecialist_B_fkey" FOREIGN KEY ("B") REFERENCES "Specialist"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavoritePosts" ADD CONSTRAINT "_UserFavoritePosts_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("postId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavoritePosts" ADD CONSTRAINT "_UserFavoritePosts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
