/*
  Warnings:

  - A unique constraint covering the columns `[cloudinaryUrl]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cloudinaryUrl` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "cloudinaryUrl" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_cloudinaryUrl_key" ON "File"("cloudinaryUrl");
