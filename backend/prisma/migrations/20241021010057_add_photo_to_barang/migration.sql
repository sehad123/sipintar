/*
  Warnings:

  - Added the required column `kondisi` to the `Barang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `barang` ADD COLUMN `kondisi` VARCHAR(191) NOT NULL,
    ADD COLUMN `photo` VARCHAR(191) NULL;
