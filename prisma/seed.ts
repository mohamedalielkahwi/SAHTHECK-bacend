import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Clean existing data ───────────────────────────────────────
  await prisma.appointment.deleteMany();
  await prisma.availabeSlot.deleteMany();
  await prisma.post.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.medicalDocument.deleteMany();
  await prisma.otp.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.specialist.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.clinic.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Cleaned existing data');

  // ─── Admin ─────────────────────────────────────────────────────
  const adminUser = await prisma.user.create({
    data: {
      fullName: 'Super Admin',
      email: 'admin@sahteck.tn',
      password: await hashPassword('admin123'),
      phone: '12345678',
      gender: 'MALE',
      address: 'Tunis, Tunisia',
      role: 'ADMIN',
      isEmailVerified: true,
      admin: {
        create: { canModerate: true },
      },
    },
  });
  console.log(`✅ Admin created: ${adminUser.email}`);

  // ─── Doctors ────────────────────────────────────────────────────
  const doctorsData = [
    {
      fullName: 'Dr. Amira Benali',
      email: 'amira.benali@sahteck.tn',
      phone: '22334455',
      gender: 'FEMALE' as const,
      address: 'Tunis, Tunisia',
      speciality: 'Cardiologie',
      bio: 'Cardiologue expérimentée avec plus de 15 ans de pratique. Spécialisée dans les maladies cardiovasculaires.',
      licenseNumber: '1234/05',
      clinic: 'Clinique du Cœur',
      location: 'Tunis, Tunisia',
      latitude: 36.8065,
      longitude: 10.1815,
      rating: 4.8,
      reviewsCount: 124,
      isValidated: true,
    },
    {
      fullName: 'Dr. Karim Meziane',
      email: 'karim.meziane@sahteck.tn',
      phone: '33445566',
      gender: 'MALE' as const,
      address: 'Sfax, Tunisia',
      speciality: 'Neurologie',
      bio: 'Neurologue spécialisé dans les troubles du mouvement et les maladies neurodégénératives.',
      licenseNumber: '5678/08',
      clinic: 'Centre Neurologique de Sfax',
      location: 'Sfax, Tunisia',
      latitude: 34.7406,
      longitude: 10.7603,
      rating: 4.6,
      reviewsCount: 89,
      isValidated: true,
    },
    {
      fullName: 'Dr. Sonia Gharbi',
      email: 'sonia.gharbi@sahteck.tn',
      phone: '44556677',
      gender: 'FEMALE' as const,
      address: 'Sousse, Tunisia',
      speciality: 'Rhumatologie',
      bio: "Rhumatologue avec expertise dans les maladies articulaires et l'arthrite.",
      licenseNumber: '9012/10',
      clinic: 'Clinique Sousse Santé',
      location: 'Sousse, Tunisia',
      latitude: 35.8254,
      longitude: 10.636,
      rating: 4.7,
      reviewsCount: 102,
      isValidated: true,
    },
    {
      fullName: 'Dr. Mohamed Trabelsi',
      email: 'mohamed.trabelsi@sahteck.tn',
      phone: '55667788',
      gender: 'MALE' as const,
      address: 'Monastir, Tunisia',
      speciality: 'Orthopédie',
      bio: 'Chirurgien orthopédiste spécialisé dans les traumatismes sportifs et la chirurgie reconstructive.',
      licenseNumber: '3456/12',
      clinic: 'Clinique Orthopédique Monastir',
      location: 'Monastir, Tunisia',
      latitude: 35.7643,
      longitude: 10.8113,
      rating: 4.9,
      reviewsCount: 156,
      isValidated: true,
    },
    {
      fullName: 'Dr. Fatma Oueslati',
      email: 'fatma.oueslati@sahteck.tn',
      phone: '66778899',
      gender: 'FEMALE' as const,
      address: 'Tunis, Tunisia',
      speciality: 'Kinésithérapie',
      bio: 'Kinésithérapeute experte en rééducation post-opératoire et troubles musculo-squelettiques.',
      licenseNumber: '7890/15',
      clinic: 'Cabinet Kiné Belvedere',
      location: 'Tunis, Tunisia',
      latitude: 36.824,
      longitude: 10.1763,
      rating: 4.5,
      reviewsCount: 78,
      isValidated: false,
    },
    {
      fullName: 'Dr. Youssef Hamdi',
      email: 'youssef.hamdi@sahteck.tn',
      phone: '77889900',
      gender: 'MALE' as const,
      address: 'Bizerte, Tunisia',
      speciality: 'Médecine du Sport',
      bio: "Médecin du sport avec 10 ans d'expérience dans le suivi des athlètes professionnels.",
      licenseNumber: '2345/18',
      clinic: 'Centre Sport & Santé Bizerte',
      location: 'Bizerte, Tunisia',
      latitude: 37.2747,
      longitude: 9.8739,
      rating: 4.4,
      reviewsCount: 65,
      isValidated: false,
    },
  ];

  const createdDoctors: Array<Awaited<ReturnType<typeof prisma.user.create>>> =
    [];
  for (const doctor of doctorsData) {
    const user = await prisma.user.create({
      data: {
        fullName: doctor.fullName,
        email: doctor.email,
        password: await hashPassword('doctor123'),
        phone: doctor.phone,
        gender: doctor.gender,
        address: doctor.address,
        role: 'DOCTOR',
        isEmailVerified: true,
        specialist: {
          create: {
            speciality: doctor.speciality,
            bio: doctor.bio,
            licenseNumber: doctor.licenseNumber,
            clinic: doctor.clinic,
            location: doctor.location,
            latitude: doctor.latitude,
            longitude: doctor.longitude,
            rating: doctor.rating,
            reviewsCount: doctor.reviewsCount,
            isValidated: doctor.isValidated,
          },
        },
      },
      include: { specialist: true },
    });
    createdDoctors.push(user);
    console.log(
      `✅ Doctor created: ${user.email} (validated: ${doctor.isValidated})`,
    );
  }

  // ─── Patients ────────────────────────────────────────────────────
  const patientsData = [
    {
      fullName: 'Mohamed Cherif',
      email: 'mohamed.cherif@gmail.com',
      phone: '11223344',
      gender: 'MALE' as const,
      address: 'Tunis, Tunisia',
      age: 45,
      weight: 82.5,
      height: 178,
    },
    {
      fullName: 'Leila Mansour',
      email: 'leila.mansour@gmail.com',
      phone: '22334411',
      gender: 'FEMALE' as const,
      address: 'Tunis, Tunisia',
      age: 35,
      weight: 65,
      height: 165,
    },
    {
      fullName: 'Omar Zitouni',
      email: 'omar.zitouni@gmail.com',
      phone: '33441122',
      gender: 'MALE' as const,
      address: 'Sfax, Tunisia',
      age: 52,
      weight: 90,
      height: 182,
    },
    {
      fullName: 'Nadia Khelifi',
      email: 'nadia.khelifi@gmail.com',
      phone: '44112233',
      gender: 'FEMALE' as const,
      address: 'Sousse, Tunisia',
      age: 28,
      weight: 58,
      height: 162,
    },
    {
      fullName: 'Hedi Bouaziz',
      email: 'hedi.bouaziz@gmail.com',
      phone: '55221133',
      gender: 'MALE' as const,
      address: 'Monastir, Tunisia',
      age: 38,
      weight: 75,
      height: 175,
    },
    {
      fullName: 'Ines Slama',
      email: 'ines.slama@gmail.com',
      phone: '66332211',
      gender: 'FEMALE' as const,
      address: 'Tunis, Tunisia',
      age: 42,
      weight: 70,
      height: 168,
    },
    {
      fullName: 'Riadh Chaabane',
      email: 'riadh.chaabane@gmail.com',
      phone: '77443322',
      gender: 'MALE' as const,
      address: 'Bizerte, Tunisia',
      age: 60,
      weight: 85,
      height: 170,
    },
    {
      fullName: 'Samira Touati',
      email: 'samira.touati@gmail.com',
      phone: '88554433',
      gender: 'FEMALE' as const,
      address: 'Tunis, Tunisia',
      age: 33,
      weight: 62,
      height: 163,
    },
  ];

  const createdPatients: Array<Awaited<ReturnType<typeof prisma.user.create>>> =
    [];
  for (const patient of patientsData) {
    const user = await prisma.user.create({
      data: {
        fullName: patient.fullName,
        email: patient.email,
        password: await hashPassword('patient123'),
        phone: patient.phone,
        gender: patient.gender,
        address: patient.address,
        role: 'PATIENT',
        isEmailVerified: true,
        patient: {
          create: {
            age: patient.age,
            weight: patient.weight,
            height: patient.height,
          },
        },
      },
      include: { patient: true },
    });
    createdPatients.push(user);
    console.log(`✅ Patient created: ${user.email}`);
  }

  // ─── Clinics ────────────────────────────────────────────────────
  const clinic1 = await prisma.clinic.create({
    data: {
      name: 'Clinique du Cœur',
      address: 'Avenue Habib Bourguiba, Tunis',
      phone: '71234567',
      email: 'contact@cliniquecoeur.tn',
      specialists: {
        connect: [
          { userId: createdDoctors[0].userId },
          { userId: createdDoctors[1].userId },
        ],
      },
    },
  });

  const clinic2 = await prisma.clinic.create({
    data: {
      name: 'Centre Médical Sfax',
      address: 'Rue de la République, Sfax',
      phone: '74234567',
      email: 'contact@centresfax.tn',
      specialists: {
        connect: [
          { userId: createdDoctors[2].userId },
          { userId: createdDoctors[3].userId },
        ],
      },
    },
  });
  console.log(`✅ Clinics created`);

  // ─── Available Slots ─────────────────────────────────────────────
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const slots: Array<Awaited<ReturnType<typeof prisma.availabeSlot.create>>> =
    [];
  for (let i = 0; i < 4; i++) {
    const slot = await prisma.availabeSlot.create({
      data: {
        date: tomorrow,
        startTime: new Date(tomorrow.getTime() + (9 + i * 2) * 60 * 60 * 1000),
        endTime: new Date(tomorrow.getTime() + (10 + i * 2) * 60 * 60 * 1000),
        isBooked: i < 2,
      },
    });
    slots.push(slot);
  }
  console.log(`✅ Available slots created`);

  // ─── Appointments ────────────────────────────────────────────────
  // ─── Appointments ────────────────────────────────────────────────
await prisma.appointment.create({
  data: {
    patientId: createdPatients[0].userId,
    specialistId: createdDoctors[0].userId,
    clinicId: clinic1.clinicId,
    availabilityId: slots[0].availabilityId,
    date: tomorrow,                              // ✅ already DateTime
    time: new Date('1970-01-01T09:00:00.000Z'), // 👈 change from '09:00' string to DateTime
    reason: 'Consultation cardiologique de routine',
    status: 'SCHEDULED',
  },
});

await prisma.appointment.create({
  data: {
    patientId: createdPatients[1].userId,
    specialistId: createdDoctors[0].userId,
    clinicId: clinic1.clinicId,
    availabilityId: slots[1].availabilityId,
    date: tomorrow,
    time: new Date('1970-01-01T11:00:00.000Z'), // 👈 change
    reason: 'Suivi post-opératoire',
    status: 'SCHEDULED',
  },
});

await prisma.appointment.create({
  data: {
    patientId: createdPatients[2].userId,
    specialistId: createdDoctors[1].userId,
    clinicId: clinic1.clinicId,
    availabilityId: slots[2].availabilityId,
    date: tomorrow,
    time: new Date('1970-01-01T13:00:00.000Z'), // 👈 change
    reason: 'Douleurs chroniques',
    status: 'COMPLETED',
  },
});
  console.log(`✅ Appointments created`);

  // ─── Content ────────────────────────────────────────────────────
  await prisma.post.createMany({
    data: [
      {
        title: '5 exercices essentiels pour le dos',
        description:
          'Des exercices simples pour renforcer les muscles du dos et prévenir les douleurs.',
        type: 'ARTICLE',
        url: 'https://example.com/article1',
        publishedById: createdDoctors[0].userId,
        isPublished: true,
      },
      {
        title: 'Comprendre la cardiologie moderne',
        description:
          'Une introduction aux avancées récentes en cardiologie interventionnelle.',
        type: 'VIDEO',
        url: 'https://example.com/video1',
        publishedById: createdDoctors[0].userId,
        isPublished: true,
      },
      {
        title: 'Gestion de la douleur chronique',
        description:
          'Approches multidisciplinaires pour la gestion de la douleur chronique.',
        type: 'ARTICLE',
        url: 'https://example.com/article2',
        publishedById: createdDoctors[1].userId,
        isPublished: false,
      },
    ],
  });
  console.log(`✅ Content created`);

  // ─── Exercises ───────────────────────────────────────────────────
  await prisma.exercise.createMany({
    data: [
      {
        name: 'Étirement du mollet',
        description:
          'Debout face à un mur, placez les mains contre le mur. Reculez un pied et gardez le talon au sol.',
        videoUrl: 'https://example.com/exercise1',
        createdById: createdDoctors[2].userId,
      },
      {
        name: 'Renforcement quadriceps',
        description:
          "Assis sur une chaise, levez une jambe à l'horizontale. Maintenez 5 secondes puis relâchez.",
        videoUrl: 'https://example.com/exercise2',
        createdById: createdDoctors[3].userId,
      },
      {
        name: 'Rotation cervicale',
        description:
          'Assis droit, tournez la tête lentement vers la droite, puis vers la gauche. Répétez 10 fois.',
        createdById: createdDoctors[2].userId,
      },
      {
        name: 'Exercice de respiration diaphragmatique',
        description:
          'Allongé sur le dos, placez une main sur le ventre. Inspirez profondément en gonflant le ventre.',
        createdById: createdDoctors[0].userId,
      },
    ],
  });
  console.log(`✅ Exercises created`);

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📋 Test accounts:');
  console.log('─────────────────────────────────────────');
  console.log('ADMIN:    admin@sahteck.tn       / admin123');
  console.log('DOCTOR:   amira.benali@sahteck.tn / doctor123');
  console.log('DOCTOR:   karim.meziane@sahteck.tn / doctor123');
  console.log('PATIENT:  mohamed.cherif@gmail.com / patient123');
  console.log('─────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
