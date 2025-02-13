/*
  Warnings:

  - A unique constraint covering the columns `[cloudinaryId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cloudinaryId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "cloudinaryId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_cloudinaryId_key" ON "File"("cloudinaryId");
