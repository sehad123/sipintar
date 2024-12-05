/*
  Warnings:

  - Added the required column `endTime` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `peminjaman` ADD COLUMN `endTime` VARCHAR(191) NOT NULL,
    ADD COLUMN `startTime` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Pengaduan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `kategori` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `jam` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(191) NULL,
    `deskripsi` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'DIPINJAM', 'DIKEMBALIKAN') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pengaduan` ADD CONSTRAINT `Pengaduan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
