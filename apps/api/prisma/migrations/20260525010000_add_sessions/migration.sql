CREATE TABLE "Session" (
  "id" TEXT NOT NULL,
  "studioId" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Session_studioId_startsAt_idx" ON "Session"("studioId", "startsAt");
CREATE INDEX "Session_projectId_startsAt_idx" ON "Session"("projectId", "startsAt");
CREATE INDEX "Session_studioId_status_startsAt_idx" ON "Session"("studioId", "status", "startsAt");

ALTER TABLE "Session"
ADD CONSTRAINT "Session_studioId_fkey"
FOREIGN KEY ("studioId") REFERENCES "Studio"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Session"
ADD CONSTRAINT "Session_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
