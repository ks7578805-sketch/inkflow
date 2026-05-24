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
