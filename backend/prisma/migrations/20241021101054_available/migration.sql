-- AlterTable
ALTER TABLE `barang` MODIFY `type` VARCHAR(191) NULL,
    ALTER COLUMN `available` DROP DEFAULT,
    MODIFY `kondisi` VARCHAR(191) NULL;
