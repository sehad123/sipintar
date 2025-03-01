/*
  Warnings:

  - You are about to drop the `pelaksana` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pengaduan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pelaksana` DROP FOREIGN KEY `Pelaksana_pengaduanId_fkey`;

-- DropForeignKey
ALTER TABLE `pelaksana` DROP FOREIGN KEY `Pelaksana_userId_fkey`;

-- DropForeignKey
ALTER TABLE `pengaduan` DROP FOREIGN KEY `Pengaduan_userId_fkey`;

-- DropTable
DROP TABLE `pelaksana`;

-- DropTable
DROP TABLE `pengaduan`;
