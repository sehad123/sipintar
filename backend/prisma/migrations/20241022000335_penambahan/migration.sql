/*
  Warnings:

  - You are about to drop the column `type` on the `barang` table. All the data in the column will be lost.
  - You are about to alter the column `available` on the `barang` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to drop the column `kategori` on the `peminjaman` table. All the data in the column will be lost.
  - You are about to drop the column `kategori` on the `pengaduan` table. All the data in the column will be lost.
  - The values [DIPINJAM,DIKEMBALIKAN] on the enum `Pengaduan_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `kategoriId` to the `Barang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kategoriId` to the `Pengaduan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `barang` DROP COLUMN `type`,
    ADD COLUMN `kategoriId` INTEGER NOT NULL,
    MODIFY `available` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `peminjaman` DROP COLUMN `kategori`;

-- AlterTable
ALTER TABLE `pengaduan` DROP COLUMN `kategori`,
    ADD COLUMN `kategoriId` INTEGER NOT NULL,
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `KategoriBarang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kategori` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KategoriPengaduan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kategori` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Barang` ADD CONSTRAINT `Barang_kategoriId_fkey` FOREIGN KEY (`kategoriId`) REFERENCES `KategoriBarang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengaduan` ADD CONSTRAINT `Pengaduan_kategoriId_fkey` FOREIGN KEY (`kategoriId`) REFERENCES `KategoriPengaduan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
