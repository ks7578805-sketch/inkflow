// Minimal idempotent owner-only seed — creates exactly: 1 studio + 1 owner
// user + 1 artist. Safe to run on any environment (uses upsert, never
// deletes data). Use this for production bootstrap when the full seed.ts
// would wipe existing sessions.
//
//   cd apps/api
//   DATABASE_URL="<prod-url>" pnpm tsx prisma/seed-owner.ts

import 'dotenv/config';
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const studioSlug = process.env.STUDIO_SLUG ?? 'inkflow-studio';
  const ownerEmail = (process.env.OWNER_EMAIL ?? 'owner@inkflow.local').toLowerCase();
  const ownerPassword = process.env.OWNER_PASSWORD ?? 'ChangeMe123!';

  const studio = await prisma.studio.upsert({
    where: { slug: studioSlug },
    update: {},
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

  const passwordHash = await argon2.hash(ownerPassword, { type: argon2.argon2id });

  const user = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {
      passwordHash,
      status: UserStatus.ACTIVE,
    },
    create: {
      studioId: studio.id,
      email: ownerEmail,
      passwordHash,
      firstName: process.env.OWNER_FIRST_NAME ?? 'Marcelo',
      lastName: process.env.OWNER_LAST_NAME ?? 'Ramos',
      role: UserRole.OWNER,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.artist.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      studioId: studio.id,
      userId: user.id,
      displayName: `${user.firstName} ${user.lastName}`,
      slug: 'owner-artist',
      active: true,
      specialties: ['Japanese', 'Realismo', 'Fineline', 'Blackwork'],
    },
  });

  console.log(`✓ Studio: ${studio.slug}`);
  console.log(`✓ Owner:  ${user.email}`);
  console.log('Login with:', ownerEmail, '/', ownerPassword);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
