/*
  Warnings:

  - You are about to alter the column `available` on the `barang` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `barang` MODIFY `available` VARCHAR(191) NULL;
