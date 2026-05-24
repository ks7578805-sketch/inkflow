-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "instagram" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Client_studioId_firstName_idx" ON "Client"("studioId", "firstName");

-- CreateIndex
CREATE INDEX "Client_studioId_lastName_idx" ON "Client"("studioId", "lastName");

-- CreateIndex
CREATE INDEX "Client_studioId_email_idx" ON "Client"("studioId", "email");

-- CreateIndex
CREATE INDEX "Client_studioId_phone_idx" ON "Client"("studioId", "phone");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
