/*
  Warnings:

  - The primary key for the `Booking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `qty` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `totalCents` on the `Booking` table. All the data in the column will be lost.
  - The primary key for the `Experience` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Experience` table. All the data in the column will be lost.
  - The primary key for the `Slot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `durationMins` on the `Slot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[experienceId,slotDate,slotTime]` on the table `Slot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerEmail` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experienceId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalPriceCents` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seats` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slotDate` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slotTime` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_slotId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Slot" DROP CONSTRAINT "Slot_experienceId_fkey";

-- DropIndex
DROP INDEX "public"."Booking_email_idx";

-- DropIndex
DROP INDEX "public"."Booking_slotId_idx";

-- DropIndex
DROP INDEX "public"."Experience_slug_key";

-- DropIndex
DROP INDEX "public"."Slot_date_idx";

-- DropIndex
DROP INDEX "public"."Slot_experienceId_idx";

-- AlterTable
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_pkey",
DROP COLUMN "email",
DROP COLUMN "fullName",
DROP COLUMN "phone",
DROP COLUMN "qty",
DROP COLUMN "totalCents",
ADD COLUMN     "customerEmail" TEXT NOT NULL,
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "experienceId" TEXT NOT NULL,
ADD COLUMN     "finalPriceCents" INTEGER NOT NULL,
ADD COLUMN     "seats" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "slotId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Booking_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Booking_id_seq";

-- AlterTable
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_pkey",
DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "slug",
DROP COLUMN "updatedAt",
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "durationMinutes" INTEGER,
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "shortDescription" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Experience_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Experience_id_seq";

-- AlterTable
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "date",
DROP COLUMN "durationMins",
ADD COLUMN     "bookedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "slotDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "slotTime" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "experienceId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Slot_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Slot_id_seq";

-- CreateTable
CREATE TABLE "Promo" (
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "validUntil" TIMESTAMP(3),

    CONSTRAINT "Promo_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "Slot_experienceId_slotDate_slotTime_key" ON "Slot"("experienceId", "slotDate", "slotTime");

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
