/*
  Warnings:

  - You are about to drop the column `jumlah_barang` on the `peminjaman` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `peminjaman` DROP COLUMN `jumlah_barang`,
    ADD COLUMN `jumlahBarang` INTEGER NULL;
