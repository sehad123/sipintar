/*
  Warnings:

  - You are about to drop the column `kategoriId` on the `pengaduan` table. All the data in the column will be lost.
  - You are about to drop the `kategoripengaduan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pengaduan` DROP FOREIGN KEY `Pengaduan_kategoriId_fkey`;

-- AlterTable
ALTER TABLE `peminjaman` ADD COLUMN `notifikasi` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `pengaduan` DROP COLUMN `kategoriId`,
    ADD COLUMN `beban_pengaduan` VARCHAR(191) NULL,
    ADD COLUMN `catatan` VARCHAR(191) NULL,
    ADD COLUMN `kategori` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `penugasan` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `kategoripengaduan`;
