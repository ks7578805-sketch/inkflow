import 'dotenv/config';
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const demoClients = [
  {
    firstName: 'Lucas',
    lastName: 'Mendes',
    phone: '+55 11 99123-4567',
    email: 'lucas.mendes@inkflow.local',
    instagram: '@lucasm.ink',
    pipelineStatus: 'Recorrente',
    notes: 'Sleeve japonês em andamento. Prefere sessões de manhã, das 9h às 13h. Alérgico a látex.',
  },
  {
    firstName: 'Ana Beatriz',
    lastName: 'Costa',
    phone: '+55 11 98765-2345',
    email: 'ana.beatriz@inkflow.local',
    instagram: '@anab.tattoo',
    pipelineStatus: 'Ativo',
    notes: 'Backpiece de realismo em aprovação. Quer referências de Andrei Petrescu. Sessões longas, aguenta bem.',
  },
  {
    firstName: 'Pedro',
    lastName: 'Oliveira',
    phone: '+55 11 97654-3456',
    email: 'pedro.oliveira@inkflow.local',
    instagram: '@pedroolv',
    pipelineStatus: 'Recorrente',
    notes: '3 tatuagens concluídas no estúdio. Muito pontual. Sempre indica amigos.',
  },
  {
    firstName: 'Marina',
    lastName: 'Santos',
    phone: '+55 11 96543-4567',
    email: 'marina.santos@inkflow.local',
    instagram: '@marinasantos.ink',
    pipelineStatus: 'Recorrente',
    notes: 'Cliente fiel desde 2023. Especialidade: fineline e lettering. Cicatriza muito bem.',
  },
  {
    firstName: 'Fernanda',
    lastName: 'Lima',
    phone: '+55 11 95432-5678',
    email: 'fernanda.lima@inkflow.local',
    instagram: '@ferlima_tattoo',
    pipelineStatus: 'Orçamento',
    notes: 'Quer aquarela no antebraço direito. Consultou em maio, aguardando resposta sobre valor.',
  },
  {
    firstName: 'Rafael',
    lastName: 'Torres',
    phone: '+55 11 94321-6789',
    email: 'rafael.torres@inkflow.local',
    instagram: '@rafa.torres.art',
    pipelineStatus: 'Ativo',
    notes: 'Old school no peito em andamento. Sensível na região do esterno, prefere sessões curtas de 2h.',
  },
  {
    firstName: 'Camila',
    lastName: 'Rodrigues',
    phone: '+55 11 93210-7890',
    email: 'camila.rodrigues@inkflow.local',
    instagram: '@camila.rodrigues.tattoo',
    pipelineStatus: 'Recorrente',
    notes: 'Cliente desde a abertura do estúdio. Já tem 6 peças. Referência de qualidade para novos clientes.',
  },
  {
    firstName: 'Bruno',
    lastName: 'Carvalho',
    phone: '+55 11 92109-8901',
    email: 'bruno.carvalho@inkflow.local',
    instagram: '@bcarvalho.ink',
    pipelineStatus: 'Orçamento',
    notes: 'Interessado em neotradicional no braço. Pediu referências de artistas europeus.',
  },
  {
    firstName: 'Isabela',
    lastName: 'Nunes',
    phone: '+55 11 91098-9012',
    email: 'isabela.nunes@inkflow.local',
    instagram: '@isabela.tatt',
    pipelineStatus: 'Ativo',
    notes: 'Sleeve feminino geométrico + botânico no braço esquerdo. Em andamento desde março.',
  },
  {
    firstName: 'Diego',
    lastName: 'Ferreira',
    phone: '+55 11 90987-0123',
    email: 'diego.ferreira@inkflow.local',
    instagram: '@diegof.arte',
    pipelineStatus: 'Inativo',
    notes: 'Sumiu após o orçamento de blackwork. Último contato em abril. Tentar reengajamento.',
  },
  {
    firstName: 'Cliente',
    lastName: 'Smoke',
    phone: '+55 11 95555-0000',
    email: 'cliente.smoke@inkflow.local',
    instagram: '@clientesmoke',
    pipelineStatus: 'Ativo',
    notes: 'Cliente usado para smoke tests locais da integração projects/calendar.',
  },
];

const demoProjects = [
  // Lucas Mendes — Sleeve Oriental (ativo, 65%)
  {
    name: 'Sleeve Oriental',
    clientName: 'Lucas Mendes',
    artistName: 'Marcelo Ramos',
    style: 'Japanese',
    bodyPart: 'Braço inteiro',
    status: 'Em andamento',
    valueEstimated: 5200,
    valueFinal: 5800,
    deposit: 1200,
    totalPaid: 3600,
    progress: 65,
    sessionsDone: 0,
    sessionsTotal: 0,
    hoursEstimated: 20,
    hoursReal: 0,
    nextSessionAt: null,
    nextSessionEndAt: null,
    nextSessionStatus: null,
    notes: 'Koi + ondas Hokusai + cerejeira no ombro. Usando paleta clássica de sumi-e. Sessão de fundo semana que vem.',
  },
  // Ana Beatriz — Backpiece Realismo (aguardando aprovação)
  {
    name: 'Backpiece Realismo',
    clientName: 'Ana Beatriz Costa',
    artistName: 'Marcelo Ramos',
    style: 'Realismo',
    bodyPart: 'Costas',
    status: 'Aguardando aprovação',
    valueEstimated: 14000,
    valueFinal: null,
    deposit: 2500,
    totalPaid: 2500,
    progress: 15,
    sessionsDone: 0,
    sessionsTotal: 0,
    hoursEstimated: 36,
    hoursReal: 0,
    nextSessionAt: null,
    nextSessionEndAt: null,
    nextSessionStatus: null,
    notes: 'Retrato de mulher com flores negras e névoa. Aguardando aprovação do sketch final. Cliente pediu ajuste no rosto.',
  },
  // Marina Santos — Fineline Floral (em andamento)
  {
    name: 'Sleeve Fineline Botânico',
    clientName: 'Marina Santos',
    artistName: 'Marcelo Ramos',
    style: 'Fineline',
    bodyPart: 'Braço inteiro',
    status: 'Em andamento',
    valueEstimated: 4400,
    valueFinal: 4600,
    deposit: 800,
    totalPaid: 2800,
    progress: 60,
    sessionsDone: 0,
    sessionsTotal: 0,
    hoursEstimated: 14,
    hoursReal: 0,
    nextSessionAt: null,
    nextSessionEndAt: null,
    nextSessionStatus: null,
    notes: 'Flores silvestres, folhagem delicada, abelha. Linha única 0.3mm. Preenchendo o canto do braço.',
  },
  // Pedro Oliveira — Lettering concluído
  {
    name: 'Lettering Manuscrito',
    clientName: 'Pedro Oliveira',
    artistName: 'Marcelo Ramos',
    style: 'Lettering',
    bodyPart: 'Costela',
    status: 'Concluído',
    valueEstimated: 1800,
    valueFinal: 1800,
    deposit: 500,
    totalPaid: 1800,
    progress: 100,
    sessionsDone: 0,
    sessionsTotal: 0,
    hoursEstimated: 5,
    hoursReal: 0,
    nextSessionAt: null,
    nextSessionEndAt: null,
    nextSessionStatus: null,
    notes: 'Frase em italiano "Non temere il buio" em script manuscrito. Concluído em 2 sessões. Cliente satisfeito.',
  },
  // Pedro Oliveira — Geométrico costas (novo projeto)
  {
    name: 'Geométrico Blackwork',
    clientName: 'Pedro Oliveira',
    artistName: 'Marcelo Ramos',
    style: 'Blackwork',
    bodyPart: 'Costas',
    status: 'Em andamento',
    valueEstimated: 7200,
    valueFinal: null,
    deposit: 1500,
    totalPaid: 1500,
    progress: 25,
    sessionsDone: 0,
    sessionsTotal: 0,
    hoursEstimated: 24,
    hoursReal: 0,
    nextSessionAt: null,
    nextSessionEndAt: null,
    nextSessionStatus: null,
    notes: 'Mandala geométrica cobrindo toda a área superior das costas. Inspiração: metatron + sacred geometry.',
  },
  // Rafael Torres — Old School peito
  {
    name: 'Old School Águia',
    clientName: 'Rafael Torres',
    artistName: 'Marcelo Ramos',
    style: 'Old School',
    bodyPart: 'Peito',
    status: 'Em andamento',
    valueEstimated: 2800,
    valueFinal: null,
    deposit: 600,
    totalPaid: 1200,
    progress: 40,
    sessionsDone: 0,
    sessionsTotal: 0,
    hoursEstimated: 8,
    hoursReal: 0,
    nextSessionAt: null,
    nextSessionEndAt: null,
    nextSessionStatus: null,
    notes: 'Águia americana com rosas e faixa. Cores vibrantes estilo americano clássico. Segunda sessão de colorido agendada.',
  },
  // Camila Rodrigues — Aquarela concluída
  {
    name: 'Aquarela Coruja',
    clientName: 'Camila Rodrigues',
    artistName: 'Marcelo Ramos',
    style: 'Aquarela',
    bodyPart: 'Ombro',
    status: 'Concluído',
    valueEstimated: 2200,
    valueFinal: 2400,
    deposit: 600,
    totalPaid: 2400,
    progress: 100,
    sessionsDone: 0,
    sessionsTotal: 0,
    hoursEstimated: 6,
    hoursReal: 0,
    nextSessionAt: null,
    nextSessionEndAt: null,
    nextSessionStatus: null,
    notes: 'Coruja com espirrações de aquarela azul e laranja. Cliente ficou apaixonada. Indicou 3 amigas.',
  },
  // Isabela Nunes — Sleeve geométrico + botânico
  {
    name: 'Sleeve Geométrico Feminino',
    clientName: 'Isabela Nunes',
    artistName: 'Marcelo Ramos',
    style: 'Fineline',
    bodyPart: 'Braço esquerdo',
    status: 'Em andamento',
    valueEstimated: 5600,
    valueFinal: null,
    deposit: 1000,
    totalPaid: 2800,
    progress: 50,
    sessionsDone: 0,
    sessionsTotal: 0,
    hoursEstimated: 18,
    hoursReal: 0,
    nextSessionAt: null,
    nextSessionEndAt: null,
    nextSessionStatus: null,
    notes: 'Combinação de linhas geométricas com elementos botânicos. Peônias + hexágonos + linhas finas. Muito detalhado.',
  },
  // Fernanda Lima — Aquarela pendente
  {
    name: 'Aquarela Borboleta',
    clientName: 'Fernanda Lima',
    artistName: 'Marcelo Ramos',
    style: 'Aquarela',
    bodyPart: 'Antebraço',
    status: 'Pendente',
    valueEstimated: 1800,
    valueFinal: null,
    deposit: 0,
    totalPaid: 0,
    progress: 0,
    sessionsDone: 0,
    sessionsTotal: 0,
    hoursEstimated: 4,
    hoursReal: 0,
    nextSessionAt: null,
    nextSessionEndAt: null,
    nextSessionStatus: null,
    notes: 'Borboleta morpho em aquarela. Cliente decidindo entre antebraço e panturrilha. Aguardando confirmação.',
  },
  // Smoke test
  {
    name: 'Projeto Smoke',
    clientName: 'Cliente Smoke',
    artistName: 'Marcelo Ramos',
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
  // Sleeve Oriental — Lucas (passadas + futuras)
  {
    projectName: 'Sleeve Oriental',
    clientName: 'Lucas Mendes',
    startsAt: '2026-04-08T09:00:00.000Z',
    endsAt: '2026-04-08T13:00:00.000Z',
    status: 'Concluída',
    notes: 'Esboço e início do contorno do koi. Cliente suportou bem as 4h.',
  },
  {
    projectName: 'Sleeve Oriental',
    clientName: 'Lucas Mendes',
    startsAt: '2026-04-29T09:00:00.000Z',
    endsAt: '2026-04-29T13:00:00.000Z',
    status: 'Concluída',
    notes: 'Detalhamento das escamas e início das ondas. Muito bom resultado.',
  },
  {
    projectName: 'Sleeve Oriental',
    clientName: 'Lucas Mendes',
    startsAt: '2026-05-20T09:00:00.000Z',
    endsAt: '2026-05-20T13:00:00.000Z',
    status: 'Concluída',
    notes: 'Contorno das ondas Hokusai + início da cerejeira. Progresso excelente.',
  },
  {
    projectName: 'Sleeve Oriental',
    clientName: 'Lucas Mendes',
    startsAt: '2026-06-10T09:00:00.000Z',
    endsAt: '2026-06-10T13:00:00.000Z',
    status: 'Confirmada',
    notes: 'Sessão de fundo — finalizar manchas da água e fundo da cerejeira.',
  },
  {
    projectName: 'Sleeve Oriental',
    clientName: 'Lucas Mendes',
    startsAt: '2026-07-01T09:00:00.000Z',
    endsAt: '2026-07-01T13:00:00.000Z',
    status: 'Confirmada',
    notes: 'Colorização final do koi — vermelho e laranja.',
  },
  // Backpiece Realismo — Ana Beatriz
  {
    projectName: 'Backpiece Realismo',
    clientName: 'Ana Beatriz Costa',
    startsAt: '2026-05-06T13:00:00.000Z',
    endsAt: '2026-05-06T18:00:00.000Z',
    status: 'Concluída',
    notes: 'Sessão de sketch e início do contorno superior. 5h intensas.',
  },
  {
    projectName: 'Backpiece Realismo',
    clientName: 'Ana Beatriz Costa',
    startsAt: '2026-06-17T13:00:00.000Z',
    endsAt: '2026-06-17T18:00:00.000Z',
    status: 'Aguardando depósito',
    notes: 'Aguardando aprovação do sketch ajustado antes de confirmar.',
  },
  // Sleeve Fineline — Marina
  {
    projectName: 'Sleeve Fineline Botânico',
    clientName: 'Marina Santos',
    startsAt: '2026-03-18T10:00:00.000Z',
    endsAt: '2026-03-18T13:00:00.000Z',
    status: 'Concluída',
    notes: 'Início do projeto — flores do punho até o cotovelo.',
  },
  {
    projectName: 'Sleeve Fineline Botânico',
    clientName: 'Marina Santos',
    startsAt: '2026-04-15T10:00:00.000Z',
    endsAt: '2026-04-15T13:00:00.000Z',
    status: 'Concluída',
    notes: 'Folhagem do ombro + abelha no antebraço. Linda execução.',
  },
  {
    projectName: 'Sleeve Fineline Botânico',
    clientName: 'Marina Santos',
    startsAt: '2026-05-13T10:00:00.000Z',
    endsAt: '2026-05-13T13:00:00.000Z',
    status: 'Concluída',
    notes: 'Conexão dos elementos + pequenos detalhes de preenchimento.',
  },
  {
    projectName: 'Sleeve Fineline Botânico',
    clientName: 'Marina Santos',
    startsAt: '2026-06-24T10:00:00.000Z',
    endsAt: '2026-06-24T13:00:00.000Z',
    status: 'Confirmada',
    notes: 'Finalizar a parte superior do braço — peônias + detalhes do ombro.',
  },
  // Lettering — Pedro (concluído)
  {
    projectName: 'Lettering Manuscrito',
    clientName: 'Pedro Oliveira',
    startsAt: '2026-03-04T14:00:00.000Z',
    endsAt: '2026-03-04T17:00:00.000Z',
    status: 'Concluída',
    notes: 'Primeira sessão — esboço e contorno completo.',
  },
  {
    projectName: 'Lettering Manuscrito',
    clientName: 'Pedro Oliveira',
    startsAt: '2026-03-25T14:00:00.000Z',
    endsAt: '2026-03-25T16:00:00.000Z',
    status: 'Concluída',
    notes: 'Retoques finais e acabamento. Projeto encerrado.',
  },
  // Geométrico Blackwork — Pedro
  {
    projectName: 'Geométrico Blackwork',
    clientName: 'Pedro Oliveira',
    startsAt: '2026-05-27T14:00:00.000Z',
    endsAt: '2026-05-27T18:00:00.000Z',
    status: 'Concluída',
    notes: 'Início das linhas geométricas externas e pontos centrais.',
  },
  {
    projectName: 'Geométrico Blackwork',
    clientName: 'Pedro Oliveira',
    startsAt: '2026-07-08T14:00:00.000Z',
    endsAt: '2026-07-08T19:00:00.000Z',
    status: 'Confirmada',
    notes: 'Continuação — preenchimento black das áreas internas.',
  },
  // Old School — Rafael
  {
    projectName: 'Old School Águia',
    clientName: 'Rafael Torres',
    startsAt: '2026-05-13T11:00:00.000Z',
    endsAt: '2026-05-13T14:00:00.000Z',
    status: 'Concluída',
    notes: 'Contorno completo da águia + rosas. Ótima sessão.',
  },
  {
    projectName: 'Old School Águia',
    clientName: 'Rafael Torres',
    startsAt: '2026-06-11T11:00:00.000Z',
    endsAt: '2026-06-11T13:00:00.000Z',
    status: 'Confirmada',
    notes: 'Colorização — começar pelo amarelo e laranja das asas.',
  },
  // Aquarela Coruja — Camila (concluída)
  {
    projectName: 'Aquarela Coruja',
    clientName: 'Camila Rodrigues',
    startsAt: '2026-04-22T10:00:00.000Z',
    endsAt: '2026-04-22T13:00:00.000Z',
    status: 'Concluída',
    notes: 'Sessão única — contorno e aquarela completos. Cliente adorou.',
  },
  // Sleeve Geométrico Feminino — Isabela
  {
    projectName: 'Sleeve Geométrico Feminino',
    clientName: 'Isabela Nunes',
    startsAt: '2026-03-25T10:00:00.000Z',
    endsAt: '2026-03-25T13:00:00.000Z',
    status: 'Concluída',
    notes: 'Esboço e início dos hexágonos — parte do pulso até metade do antebraço.',
  },
  {
    projectName: 'Sleeve Geométrico Feminino',
    clientName: 'Isabela Nunes',
    startsAt: '2026-04-29T10:00:00.000Z',
    endsAt: '2026-04-29T13:00:00.000Z',
    status: 'Concluída',
    notes: 'Adicionando as peônias sobre os hexágonos. Ficou incrível.',
  },
  {
    projectName: 'Sleeve Geométrico Feminino',
    clientName: 'Isabela Nunes',
    startsAt: '2026-06-03T10:00:00.000Z',
    endsAt: '2026-06-03T13:00:00.000Z',
    status: 'Concluída',
    notes: 'Região do cotovelo — linhas geométricas de transição.',
  },
  {
    projectName: 'Sleeve Geométrico Feminino',
    clientName: 'Isabela Nunes',
    startsAt: '2026-06-19T10:00:00.000Z',
    endsAt: '2026-06-19T13:00:00.000Z',
    status: 'Confirmada',
    notes: 'Braço superior — flores de peônia grandes + linhas finas do ombro.',
  },
  // Projeto Smoke
  {
    projectName: 'Projeto Smoke',
    clientName: 'Cliente Smoke',
    startsAt: '2026-06-10T10:00:00.000Z',
    endsAt: '2026-06-10T14:00:00.000Z',
    status: 'Confirmada',
    notes: 'Sessão de smoke test para validar múltiplas sessões.',
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
      firstName: process.env.OWNER_FIRST_NAME ?? 'Marcelo',
      lastName: process.env.OWNER_LAST_NAME ?? 'Ramos',
      role: UserRole.OWNER,
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
    update: {
      studioId: studio.id,
      displayName: `${user.firstName} ${user.lastName}`,
      slug: 'owner-artist',
      active: true,
      specialties: ['Japanese', 'Realismo', 'Fineline', 'Blackwork'],
    },
    create: {
      studioId: studio.id,
      userId: user.id,
      displayName: `${user.firstName} ${user.lastName}`,
      slug: 'owner-artist',
      active: true,
      specialties: ['Japanese', 'Realismo', 'Fineline', 'Blackwork'],
    },
  });

  for (const client of demoClients) {
    const existingClient = await prisma.client.findFirst({
      where: { studioId: studio.id, email: client.email },
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
          pipelineStatus: client.pipelineStatus,
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
        pipelineStatus: client.pipelineStatus,
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
        data: { ...project, clientId: client?.id ?? null },
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

  await prisma.session.deleteMany({ where: { studioId: studio.id } });

  for (const session of demoSessions) {
    const project = projects.find(
      (item) => item.name === session.projectName && item.clientName === session.clientName,
    );

    if (!project) continue;

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

  // Recalculate project session stats
  for (const project of projects) {
    const sessions = await prisma.session.findMany({
      where: { studioId: studio.id, projectId: project.id },
      orderBy: { startsAt: 'asc' },
    });

    const now = new Date();
    const upcoming =
      sessions.find((s) => s.status !== 'Cancelada' && s.startsAt >= now) ?? null;
    const completed = sessions.filter((s) => s.status === 'Concluída');
    const hoursReal = completed.reduce(
      (total, s) => total + (s.endsAt.getTime() - s.startsAt.getTime()) / (60 * 60 * 1000),
      0,
    );

    await prisma.project.update({
      where: { id: project.id },
      data: {
        sessionsTotal: sessions.length,
        sessionsDone: completed.length,
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
