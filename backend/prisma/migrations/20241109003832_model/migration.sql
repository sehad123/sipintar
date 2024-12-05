/*
  Warnings:

  - You are about to drop the column `penugasan` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `penugasan`,
    ADD COLUMN `no_hp` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Pelaksana` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `pengaduanId` INTEGER NOT NULL,
    `tgl_penugasan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tgl_selesai` DATETIME(3) NULL,
    `is_selesai` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pelaksana` ADD CONSTRAINT `Pelaksana_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pelaksana` ADD CONSTRAINT `Pelaksana_pengaduanId_fkey` FOREIGN KEY (`pengaduanId`) REFERENCES `Pengaduan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
