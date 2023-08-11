/*
  Warnings:

  - You are about to drop the column `emailConfirmed` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailConfirmed",
ADD COLUMN     "token" TEXT,
ADD COLUMN     "tokenExpires" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
