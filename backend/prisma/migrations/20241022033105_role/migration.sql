-- AlterTable
ALTER TABLE `peminjaman` ADD COLUMN `nama_peminjam` VARCHAR(191) NULL,
    ADD COLUMN `role_peminjam` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `pengaduan` ADD COLUMN `nama_pengadu` VARCHAR(191) NULL,
    ADD COLUMN `role_pengadu` VARCHAR(191) NULL;
