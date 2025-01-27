/*
  Warnings:

  - You are about to drop the column `reminderDate` on the `Journal` table. All the data in the column will be lost.
  - You are about to drop the column `weather` on the `Journal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Journal" DROP COLUMN "reminderDate",
DROP COLUMN "weather",
ADD COLUMN     "position" TEXT;
