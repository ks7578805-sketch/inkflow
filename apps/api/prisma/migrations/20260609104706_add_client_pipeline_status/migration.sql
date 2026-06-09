-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "pipelineStatus" TEXT NOT NULL DEFAULT 'Interesse';

-- CreateIndex
CREATE INDEX "Client_studioId_pipelineStatus_idx" ON "Client"("studioId", "pipelineStatus");
