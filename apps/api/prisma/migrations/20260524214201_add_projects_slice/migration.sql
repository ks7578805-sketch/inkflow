-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "artistName" TEXT,
    "style" TEXT,
    "bodyPart" TEXT,
    "status" TEXT NOT NULL,
    "valueEstimated" INTEGER NOT NULL DEFAULT 0,
    "valueFinal" INTEGER,
    "deposit" INTEGER NOT NULL DEFAULT 0,
    "totalPaid" INTEGER NOT NULL DEFAULT 0,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "sessionsDone" INTEGER NOT NULL DEFAULT 0,
    "sessionsTotal" INTEGER NOT NULL DEFAULT 0,
    "hoursEstimated" INTEGER NOT NULL DEFAULT 0,
    "hoursReal" INTEGER NOT NULL DEFAULT 0,
    "nextSessionAt" TIMESTAMP(3),
    "notes" TEXT,
    "thumbnailUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_studioId_createdAt_idx" ON "Project"("studioId", "createdAt");

-- CreateIndex
CREATE INDEX "Project_studioId_status_idx" ON "Project"("studioId", "status");

-- CreateIndex
CREATE INDEX "Project_studioId_clientName_idx" ON "Project"("studioId", "clientName");

-- CreateIndex
CREATE INDEX "Project_studioId_artistName_idx" ON "Project"("studioId", "artistName");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
