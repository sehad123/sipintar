/*
  Warnings:

  - You are about to drop the column `subscription` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `peminjaman` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'DIKEMBALIKAN', 'DIPINJAM') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `subscription`;
