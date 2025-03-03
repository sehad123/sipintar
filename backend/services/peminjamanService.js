const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkBarangAvailability = async (barangId, startDate, endDate) => {
  const barang = await prisma.aset.findUnique({
    where: { id: parseInt(barangId, 10) },
    select: { kategoriId: true, jumlah: true, name: true }, // Ambil kategoriId dan jumlah
  });

  if (!barang) {
    throw new Error("Barang tidak ditemukan");
  }

  // Jika kategori adalah "tempat" (kategoriId = 2), cek konflik peminjaman
  if (barang.kategoriId === 2) {
    const conflicts = await prisma.peminjaman.findMany({
      where: {
        barangId: parseInt(barangId, 10),
        AND: [{ startDate: { lte: new Date(endDate) } }, { endDate: { gte: new Date(startDate) } }, { status: { in: ["PENDING", "APPROVED"] } }],
      },
      include: {
        barang: {
          select: { name: true },
        },
      },
    });

    if (conflicts.length > 0) {
      return {
        name: conflicts[0].barang.name,
        startDate: conflicts[0].startDate,
        endDate: conflicts[0].endDate,
      };
    }
  }

  // Jika kategori adalah "barang" (kategoriId = 1), cek stok
  if (barang.kategoriId === 1 && barang.jumlah <= 0) {
    throw new Error(`Stok barang "${barang.name}" tidak tersedia.`);
  }

  return null; // Barang tersedia
};
const createPeminjaman = async ({ userId, barangId, startDate, endDate, startTime, endTime, keperluan, nama_kegiatan, bukti_persetujuan, jumlahBarang }) => {
  const barang = await prisma.aset.findUnique({ where: { id: parseInt(barangId, 10) } });
  if (!barang) {
    throw new Error("Barang tidak ditemukan");
  }

  // Jika kategori barang (kategoriId = 1), cek stok
  if (barang.kategoriId === 1) {
    if (barang.jumlah < jumlahBarang) {
      throw new Error(`Jumlah barang yang dipinjam melebihi stok yang tersedia (${barang.jumlah})`);
    }

    // Update jumlah barang di database
    await prisma.aset.update({
      where: { id: parseInt(barangId, 10) },
      data: { jumlah: barang.jumlah - jumlahBarang },
    });
  }

  // Buat peminjaman
  const peminjaman = await prisma.peminjaman.create({
    data: {
      userId,
      barangId: parseInt(barangId, 10),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime,
      endTime,
      keperluan,
      nama_kegiatan,
      bukti_persetujuan,
      status: "PENDING",
      jumlahBarang,
    },
  });

  return peminjaman;
};
const approvePeminjaman = async (id, catatan) => {
  // Mulai transaksi agar update peminjaman dan barang terjadi bersamaan
  const transaction = await prisma.$transaction(async (prisma) => {
    // Update status peminjaman menjadi "APPROVED"
    const peminjaman = await prisma.peminjaman.update({
      where: { id },
      data: { status: "APPROVED", catatan: catatan, notifikasi: "Ya" },
    });

    if (!peminjaman) {
      throw new Error("Peminjaman tidak ditemukan");
    }

    // Update barang yang dipinjam, set kolom 'available' menjadi 'Tidak' jika stok 0
    const barang = await prisma.aset.findUnique({ where: { id: peminjaman.barangId } });
    if (barang.kategoriId === 1 && barang.jumlah === 0) {
      // Ganti "1" dengan ID kategori barang
      await prisma.aset.update({
        where: { id: peminjaman.barangId },
        data: { available: "Tidak" },
      });
    }

    return peminjaman;
  });

  return transaction;
};

const returnBarang = async (id, buktiPengembalian) => {
  try {
    const peminjaman = await prisma.peminjaman.findUnique({ where: { id } });
    if (!peminjaman) {
      throw new Error("Peminjaman tidak ditemukan");
    }

    // Tambahkan kembali jumlah barang yang dipinjam hanya untuk kategori barang
    const barang = await prisma.aset.findUnique({ where: { id: peminjaman.barangId } });
    if (barang.kategoriId === 1) {
      // Ganti "1" dengan ID kategori barang
      await prisma.aset.update({
        where: { id: peminjaman.barangId },
        data: { jumlah: { increment: peminjaman.jumlahBarang } },
      });
    }

    // Update status peminjaman
    const updatedPeminjaman = await prisma.peminjaman.update({
      where: { id },
      data: {
        status: "DIKEMBALIKAN",
        bukti_pengembalian: buktiPengembalian,
      },
    });

    return updatedPeminjaman;
  } catch (error) {
    console.error("Error di returnBarang:", error);
    throw new Error("Gagal mengembalikan barang: " + error.message);
  }
};

const rejectPeminjaman = async (id, catatan) => {
  try {
    // Mulai transaksi agar update peminjaman dan barang terjadi bersamaan
    const transaction = await prisma.$transaction(async (prisma) => {
      // Update status peminjaman menjadi "REJECTED"
      const peminjaman = await prisma.peminjaman.update({
        where: { id },
        data: { status: "REJECTED", catatan: catatan, notifikasi: "Ya" },
      });

      if (!peminjaman) {
        throw new Error("Peminjaman tidak ditemukan");
      }

      // Cek apakah barang termasuk dalam kategori barang
      const barang = await prisma.aset.findUnique({ where: { id: peminjaman.barangId } });
      if (barang.kategoriId === 1) {
        // Ganti "1" dengan ID kategori barang
        // Tambahkan kembali jumlah barang yang dipinjam
        await prisma.aset.update({
          where: { id: peminjaman.barangId },
          data: { jumlah: { increment: peminjaman.jumlahBarang } },
        });
      }

      return peminjaman;
    });

    return transaction;
  } catch (error) {
    console.error("Error di rejectPeminjaman:", error);
    throw new Error("Gagal menolak peminjaman: " + error.message);
  }
};

const pencetNotifikasi = async (userId) => {
  // Mengupdate semua data peminjaman yang memiliki userId yang sama dan mengubah status notifikasi menjadi "Tidak"
  const peminjaman = await prisma.peminjaman.updateMany({
    where: { userId }, // Mencari semua peminjaman dengan userId yang sesuai
    data: { notifikasi: "Tidak" }, // Mengubah nilai kolom 'notifikasi' menjadi "Tidak"
  });

  // Mengecek apakah ada perubahan yang terjadi
  if (peminjaman.count === 0) {
    throw new Error("Tidak ada peminjaman yang ditemukan untuk user ini");
  }

  return peminjaman;
};

// Example query in your service to fetch peminjaman with the associated barang name
const trackPeminjaman = async (userId) => {
  const peminjaman = await prisma.peminjaman.findMany({
    where: { userId },
    include: {
      barang: {
        // Include related barang data
        select: { name: true, jumlah: true, kategoriId: true }, // Select only the 'name' field from barang
      },
    },
    orderBy: {
      createdAt: "desc", // Mengurutkan berdasarkan 'createdAt' secara menurun
    },
  });

  if (!peminjaman.length) {
    throw new Error("Peminjaman tidak ditemukan untuk user ini");
  }

  return peminjaman;
};

const trackPeminjamanNotifikasi = async (userId) => {
  const peminjaman = await prisma.peminjaman.findMany({
    where: {
      userId: userId,
      // catatan: {
      //   not: "", // Filter agar kolom 'catatan' tidak kosong
      // },
      notifikasi: "Ya",
    },
    include: {
      barang: {
        // Include related barang data
        select: { name: true, jumlah: true, kategoriId: true }, // Select only the 'name' field from barang
      },
    },
    orderBy: {
      createdAt: "desc", // Mengurutkan berdasarkan 'createdAt' secara menurun
    },
  });

  if (!peminjaman.length) {
    throw new Error("Peminjaman tidak ditemukan untuk user ini");
  }

  return peminjaman;
};

const countPeminjamanWithCatatan = async (userId) => {
  try {
    const count = await prisma.peminjaman.count({
      where: {
        userId: userId,
        catatan: {
          not: "", // Filter agar kolom 'catatan' tidak kosong
        },
        notifikasi: "Ya",
      },
    });

    return count; // Mengembalikan nilai count tanpa error jika 0
  } catch (error) {
    throw new Error("Gagal menghitung peminjaman dengan catatan: " + error.message);
  }
};

// Fetch all peminjaman data, including related barang and user information
const getAllPeminjaman = async () => {
  const peminjamanList = await prisma.peminjaman.findMany({
    include: {
      barang: {
        select: { name: true, jumlah: true, kategoriId: true }, // Select the 'name' field from barang
      },
      user: {
        select: { name: true, email: true, role: true }, // Select the 'name' and 'email' fields from the user
      },
    },
    orderBy: {
      createdAt: "desc", // Mengurutkan berdasarkan 'createdAt' secara menurun
    },
  });

  if (!peminjamanList.length) {
    throw new Error("Belum ada data peminjaman");
  }

  return peminjamanList;
};

const countPendingPeminjaman = async () => {
  const pendingCount = await prisma.peminjaman.count({
    where: {
      status: "PENDING",
    },
  });

  return pendingCount;
};

const countDipinjamPeminjaman = async () => {
  const pendingCount = await prisma.peminjaman.count({
    where: {
      status: "APPROVED",
    },
  });

  return pendingCount;
};

const countDitolakPeminjaman = async () => {
  const pendingCount = await prisma.peminjaman.count({
    where: {
      status: "REJECTED",
    },
  });

  return pendingCount;
};

const countDikembalikanPeminjaman = async () => {
  const pendingCount = await prisma.peminjaman.count({
    where: {
      status: "DIKEMBALIKAN",
    },
  });

  return pendingCount;
};

module.exports = {
  createPeminjaman,
  countDikembalikanPeminjaman,
  countDipinjamPeminjaman,
  countDitolakPeminjaman,
  rejectPeminjaman,
  pencetNotifikasi,
  countPendingPeminjaman,
  getAllPeminjaman,
  approvePeminjaman,
  returnBarang,
  trackPeminjaman,
  countPeminjamanWithCatatan,
  trackPeminjamanNotifikasi,
  checkBarangAvailability,
};
