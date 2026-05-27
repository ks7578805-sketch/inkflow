-- CreateEnum
CREATE TYPE "StencilGenerationStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "StencilVariantKind" AS ENUM ('line_only', 'light_shade', 'heavy_shade');

-- CreateTable
CREATE TABLE "StencilAsset" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "storagePath" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StencilAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StencilGeneration" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "projectId" TEXT,
    "selectedStyle" TEXT NOT NULL,
    "lineThickness" INTEGER NOT NULL,
    "simplify" INTEGER NOT NULL,
    "layerCount" INTEGER NOT NULL,
    "lineColor" TEXT NOT NULL,
    "outputSize" TEXT NOT NULL,
    "analysisJson" JSONB,
    "status" "StencilGenerationStatus" NOT NULL DEFAULT 'PENDING',
    "savedVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StencilGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StencilVersion" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "kind" "StencilVariantKind" NOT NULL,
    "label" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "storagePath" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "metadataJson" JSONB,
    "savedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StencilVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StencilAsset_studioId_createdAt_idx" ON "StencilAsset"("studioId", "createdAt");

-- CreateIndex
CREATE INDEX "StencilAsset_createdByUserId_createdAt_idx" ON "StencilAsset"("createdByUserId", "createdAt");

-- CreateIndex
CREATE INDEX "StencilGeneration_studioId_createdAt_idx" ON "StencilGeneration"("studioId", "createdAt");

-- CreateIndex
CREATE INDEX "StencilGeneration_assetId_idx" ON "StencilGeneration"("assetId");

-- CreateIndex
CREATE INDEX "StencilGeneration_projectId_idx" ON "StencilGeneration"("projectId");

-- CreateIndex
CREATE INDEX "StencilVersion_generationId_createdAt_idx" ON "StencilVersion"("generationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StencilVersion_generationId_kind_key" ON "StencilVersion"("generationId", "kind");

-- AddForeignKey
ALTER TABLE "StencilAsset" ADD CONSTRAINT "StencilAsset_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StencilAsset" ADD CONSTRAINT "StencilAsset_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StencilGeneration" ADD CONSTRAINT "StencilGeneration_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StencilGeneration" ADD CONSTRAINT "StencilGeneration_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StencilGeneration" ADD CONSTRAINT "StencilGeneration_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "StencilAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StencilGeneration" ADD CONSTRAINT "StencilGeneration_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StencilGeneration" ADD CONSTRAINT "StencilGeneration_savedVersionId_fkey" FOREIGN KEY ("savedVersionId") REFERENCES "StencilVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StencilVersion" ADD CONSTRAINT "StencilVersion_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "StencilGeneration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
