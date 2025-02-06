/*
  Warnings:

  - Changed the type of `uploadTime` on the `File` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "uploadTime",
ADD COLUMN     "uploadTime" TIMESTAMP(3) NOT NULL;
