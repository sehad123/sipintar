/*
  Warnings:

  - You are about to drop the column `nama_peminjam` on the `peminjaman` table. All the data in the column will be lost.
  - You are about to drop the column `role_peminjam` on the `peminjaman` table. All the data in the column will be lost.
  - You are about to drop the column `nama_pengadu` on the `pengaduan` table. All the data in the column will be lost.
  - You are about to drop the column `role_pengadu` on the `pengaduan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `peminjaman` DROP COLUMN `nama_peminjam`,
    DROP COLUMN `role_peminjam`;

-- AlterTable
ALTER TABLE `pengaduan` DROP COLUMN `nama_pengadu`,
    DROP COLUMN `role_pengadu`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `subscription` JSON NULL;
