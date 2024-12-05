/*
  Warnings:

  - You are about to drop the column `beban_pengaduan` on the `pengaduan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pengaduan` DROP COLUMN `beban_pengaduan`,
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'ONPROGGRESS') NOT NULL DEFAULT 'PENDING';
