/*
  Warnings:

  - You are about to drop the column `name` on the `Service` table. All the data in the column will be lost.
  - Added the required column `title` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "shippingInfo" TEXT;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "duration" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "syllabus" TEXT,
ADD COLUMN     "tag" TEXT;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "name",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "tag" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
