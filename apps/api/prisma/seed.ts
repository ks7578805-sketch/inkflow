import 'dotenv/config';
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const demoClients = [
  {
    firstName: 'Lucas',
    lastName: 'Mendes',
    phone: '+55 11 99999-1234',
    email: 'lucas.mendes@inkflow.local',
    instagram: '@lucasm.ink',
    notes: 'Sleeve japonês em andamento. Prefere sessões pela manhã.',
  },
  {
    firstName: 'Ana',
    lastName: 'Beatriz',
    phone: '+55 11 98888-5678',
    email: 'ana.beatriz@inkflow.local',
    instagram: '@anab.tattoo',
    notes: 'Primeira tatuagem no estúdio. Acompanhar cicatrização.',
  },
  {
    firstName: 'Pedro',
    lastName: 'Oliveira',
    phone: '+55 11 97777-9012',
    email: 'pedro.oliveira@inkflow.local',
    instagram: '@pedroolv',
    notes: 'Projeto de costas em desenvolvimento.',
  },
  {
    firstName: 'Marina',
    lastName: 'Santos',
    phone: '+55 11 96666-3456',
    email: 'marina.santos@inkflow.local',
    instagram: '@marinasantos',
    notes: 'Cliente recorrente para lettering e fineline.',
  },
  {
    firstName: 'Cliente',
    lastName: 'Smoke',
    phone: '+55 11 95555-0000',
    email: 'cliente.smoke@inkflow.local',
    instagram: '@clientesmoke',
    notes: 'Cliente usado para smoke tests locais da integração projects/calendar.',
  },
];

const demoProjects = [
  {
    name: 'Sleeve Oriental',
    clientName: 'Lucas Mendes',
    artistName: 'Rafael Ink',
    style: 'Japanese',
    bodyPart: 'Braço inteiro',
    status: 'Em andamento',
    valueEstimated: 4800,
    valueFinal: 5200,
    deposit: 1000,
    totalPaid: 3200,
    progress: 65,
    sessionsDone: 0,
    sessionsTotal: 0,
    hoursEstimated: 18,
    hoursReal: 0,
    nextSessionAt: null,
    nextSessionEndAt: null,
    nextSessionStatus: null,
    notes: 'Projeto real migrado do mock para validar listagem, detalhe e edição.',
  },
  {
    name: 'Backpiece Realismo',
    clientName: 'Ana Beatriz',
    artistName: 'Marta Velez',
    style: 'Realismo',
    bodyPart: 'Costas',
    status: 'Aguardando aprovação',
    valueEstimated: 12000,
    valueFinal: null,
    deposit: 2000,
    totalPaid: 2000,
    progress: 20,
    sessionsDone: 0,
    sessionsTotal: 0,
    hoursEstimated: 32,
    hoursReal: 0,
    nextSessionAt: null,
    nextSessionEndAt: null,
    nextSessionStatus: null,
    notes: 'Aguardando aprovação final do desenho antes das próximas sessões.',
  },
  {
    name: 'Fineline Floral',
    clientName: 'Marina Santos',
    artistName: 'Camila Torres',
    style: 'Fineline',
    bodyPart: 'Ombro',
    status: 'Pendente',
    valueEstimated: 2200,
    valueFinal: null,
    deposit: 500,
    totalPaid: 500,
    progress: 5,
    sessionsDone: 0,
    sessionsTotal: 0,
    hoursEstimated: 6,
    hoursReal: 0,
    nextSessionAt: null,
    nextSessionEndAt: null,
    nextSessionStatus: null,
    notes: 'Aguardando confirmação da primeira sessão.',
  },
  {
    name: 'Projeto Smoke',
    clientName: 'Cliente Smoke',
    artistName: 'Rafael Ink',
    style: 'Blackwork',
    bodyPart: 'Antebraço',
    status: 'Em andamento',
    valueEstimated: 1500,
    valueFinal: null,
    deposit: 0,
    totalPaid: 0,
    progress: 35,
    sessionsDone: 0,
    sessionsTotal: 0,
    hoursEstimated: 0,
    hoursReal: 0,
    nextSessionAt: null,
    nextSessionEndAt: null,
    nextSessionStatus: null,
    notes: 'Projeto usado para smoke tests locais da integração.',
  },
];

const demoSessions = [
  {
    projectName: 'Sleeve Oriental',
    clientName: 'Lucas Mendes',
    startsAt: '2026-05-28T10:00:00.000Z',
    endsAt: '2026-05-28T13:00:00.000Z',
    status: 'Confirmada',
    notes: 'Sessão futura principal do projeto.',
  },
  {
    projectName: 'Sleeve Oriental',
    clientName: 'Lucas Mendes',
    startsAt: '2026-06-10T10:00:00.000Z',
    endsAt: '2026-06-10T14:00:00.000Z',
    status: 'Confirmada',
    notes: 'Segunda sessão futura do mesmo projeto para validar múltiplas sessões.',
  },
  {
    projectName: 'Backpiece Realismo',
    clientName: 'Ana Beatriz',
    startsAt: '2026-06-02T13:00:00.000Z',
    endsAt: '2026-06-02T17:00:00.000Z',
    status: 'Aguardando depósito',
    notes: 'Sessão futura aguardando sinal.',
  },
  {
    projectName: 'Backpiece Realismo',
    clientName: 'Ana Beatriz',
    startsAt: '2026-05-10T13:00:00.000Z',
    endsAt: '2026-05-10T17:00:00.000Z',
    status: 'Concluída',
    notes: 'Sessão concluída para alimentar resumo do projeto.',
  },
  {
    projectName: 'Fineline Floral',
    clientName: 'Marina Santos',
    startsAt: '2026-06-15T09:00:00.000Z',
    endsAt: '2026-06-15T11:00:00.000Z',
    status: 'Confirmada',
    notes: 'Primeira sessão futura do projeto fineline.',
  },
];

async function main() {
  const studioSlug = process.env.STUDIO_SLUG ?? 'inkflow-studio';
  const ownerEmail = (process.env.OWNER_EMAIL ?? 'owner@inkflow.local').toLowerCase();

  const studio = await prisma.studio.upsert({
    where: { slug: studioSlug },
    update: {
      name: process.env.STUDIO_NAME ?? 'InkFlow Studio',
      timezone: process.env.STUDIO_TIMEZONE ?? 'America/Sao_Paulo',
      currency: process.env.STUDIO_CURRENCY ?? 'BRL',
      locale: process.env.STUDIO_LOCALE ?? 'pt-BR',
      email: process.env.STUDIO_EMAIL ?? 'studio@inkflow.local',
      phone: process.env.STUDIO_PHONE ?? '+55 11 99999-0000',
    },
    create: {
      name: process.env.STUDIO_NAME ?? 'InkFlow Studio',
      slug: studioSlug,
      timezone: process.env.STUDIO_TIMEZONE ?? 'America/Sao_Paulo',
      currency: process.env.STUDIO_CURRENCY ?? 'BRL',
      locale: process.env.STUDIO_LOCALE ?? 'pt-BR',
      email: process.env.STUDIO_EMAIL ?? 'studio@inkflow.local',
      phone: process.env.STUDIO_PHONE ?? '+55 11 99999-0000',
    },
  });

  const passwordHash = await argon2.hash(process.env.OWNER_PASSWORD ?? 'ChangeMe123!', {
    type: argon2.argon2id,
  });

  const user = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {
      studioId: studio.id,
      passwordHash,
      firstName: process.env.OWNER_FIRST_NAME ?? 'Ink',
      lastName: process.env.OWNER_LAST_NAME ?? 'Flow',
      role: UserRole.OWNER,
      status: UserStatus.ACTIVE,
    },
    create: {
      studioId: studio.id,
      email: ownerEmail,
      passwordHash,
      firstName: process.env.OWNER_FIRST_NAME ?? 'Ink',
      lastName: process.env.OWNER_LAST_NAME ?? 'Flow',
      role: UserRole.OWNER,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.artist.upsert({
    where: { userId: user.id },
    update: {
      studioId: studio.id,
      displayName: `${user.firstName} ${user.lastName}`,
      slug: 'owner-artist',
      active: true,
      specialties: ['management'],
    },
    create: {
      studioId: studio.id,
      userId: user.id,
      displayName: `${user.firstName} ${user.lastName}`,
      slug: 'owner-artist',
      active: true,
      specialties: ['management'],
    },
  });

  for (const client of demoClients) {
    const existingClient = await prisma.client.findFirst({
      where: {
        studioId: studio.id,
        email: client.email,
      },
      select: { id: true },
    });

    if (existingClient) {
      await prisma.client.update({
        where: { id: existingClient.id },
        data: {
          firstName: client.firstName,
          lastName: client.lastName,
          phone: client.phone,
          instagram: client.instagram,
          notes: client.notes,
        },
      });
      continue;
    }

    await prisma.client.create({
      data: {
        studioId: studio.id,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        email: client.email,
        instagram: client.instagram,
        notes: client.notes,
      },
    });
  }

  for (const project of demoProjects) {
    const [clientFirstName, ...clientLastNameParts] = project.clientName.split(' ');
    const client = await prisma.client.findFirst({
      where: {
        studioId: studio.id,
        firstName: clientFirstName,
        lastName: clientLastNameParts.join(' '),
      },
      select: { id: true },
    });

    const existingProject = await prisma.project.findFirst({
      where: {
        studioId: studio.id,
        name: project.name,
        clientName: project.clientName,
      },
      select: { id: true },
    });

    if (existingProject) {
      await prisma.project.update({
        where: { id: existingProject.id },
        data: {
          ...project,
          clientId: client?.id ?? null,
        },
      });
      continue;
    }

    await prisma.project.create({
      data: {
        studioId: studio.id,
        clientId: client?.id ?? null,
        ...project,
      },
    });
  }

  const projects = await prisma.project.findMany({
    where: { studioId: studio.id },
    select: { id: true, name: true, clientName: true },
  });

  await prisma.session.deleteMany({
    where: { studioId: studio.id },
  });

  for (const session of demoSessions) {
    const project = projects.find(
      (item) => item.name === session.projectName && item.clientName === session.clientName,
    );

    if (!project) {
      continue;
    }

    await prisma.session.create({
      data: {
        studioId: studio.id,
        projectId: project.id,
        startsAt: new Date(session.startsAt),
        endsAt: new Date(session.endsAt),
        status: session.status,
        notes: session.notes,
      },
    });
  }

  for (const project of projects) {
    const sessions = await prisma.session.findMany({
      where: { studioId: studio.id, projectId: project.id },
      orderBy: { startsAt: 'asc' },
    });

    const now = new Date();
    const upcoming = sessions.find((session) => session.status !== 'Cancelada' && session.startsAt >= now) ?? null;
    const completedSessions = sessions.filter((session) => session.status === 'Concluída');
    const hoursReal = completedSessions.reduce(
      (total, session) => total + (session.endsAt.getTime() - session.startsAt.getTime()) / (60 * 60 * 1000),
      0,
    );

    await prisma.project.update({
      where: { id: project.id },
      data: {
        sessionsTotal: sessions.length,
        sessionsDone: completedSessions.length,
        hoursReal: Math.round(hoursReal * 100) / 100,
        nextSessionAt: upcoming?.startsAt ?? null,
        nextSessionEndAt: upcoming?.endsAt ?? null,
        nextSessionStatus: upcoming?.status ?? null,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
