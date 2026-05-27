ALTER TABLE "Project"
ADD COLUMN "clientId" TEXT;

UPDATE "Project" AS p
SET "clientId" = c."id"
FROM "Client" AS c
WHERE p."studioId" = c."studioId"
  AND p."clientName" = CONCAT(c."firstName", ' ', c."lastName");

CREATE INDEX "Project_studioId_clientId_idx" ON "Project"("studioId", "clientId");

ALTER TABLE "Project"
ADD CONSTRAINT "Project_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "Client"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
