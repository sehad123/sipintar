const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkBarangAvailability = async (barangId, startDate, endDate) => {
  const conflicts = await prisma.peminjaman.findMany({
    where: {
      barangId: parseInt(barangId, 10), // Pastikan barangId bertipe integer
      AND: [
        { startDate: { lte: new Date(endDate) } }, // Peminjaman yang dimulai sebelum atau pada endDate
        { endDate: { gte: new Date(startDate) } }, // Peminjaman yang berakhir setelah atau pada startDate
        { status: "PENDING" }, // Hanya cek peminjaman dengan status PENDING
      ],
    },
    include: {
      barang: {
        select: { name: true }, // Sertakan nama barang
      },
    },
  });

  if (conflicts.length > 0) {
    // Kembalikan objek berisi nama barang dan tanggal peminjaman yang bertabrakan
    return {
      name: conflicts[0].barang.name,
      startDate: conflicts[0].startDate,
      endDate: conflicts[0].endDate,
    };
  }
  return null; // Barang tersedia
};
const createPeminjaman = async ({ userId, barangId, startDate, endDate, startTime, endTime, keperluan, kategori, nama_kegiatan, bukti_persetujuan }) => {
  console.log("Menerima file bukti persetujuan:", bukti_persetujuan); // Debug log

  const peminjaman = await prisma.peminjaman.create({
    data: {
      userId,
      barangId: parseInt(barangId, 10),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime,
      endTime,
      keperluan,
      kategori,
      nama_kegiatan,
      bukti_pengembalian: "",
      catatan: "",
      notifikasi: "",
      status: "PENDING",
      bukti_persetujuan, // Path file yang diunggah
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

    // Update barang yang dipinjam, set kolom 'available' menjadi 'Tidak'
    await prisma.barang.update({
      where: { id: peminjaman.barangId },
      data: { available: "Tidak" },
    });

    return peminjaman;
  });

  return transaction;
};
const rejectPeminjaman = async (id, catatan) => {
  const peminjaman = await prisma.peminjaman.update({
    where: { id },
    data: { status: "REJECTED", catatan: catatan, notifikasi: "Ya" },
  });

  if (!peminjaman) {
    throw new Error("Peminjaman tidak ditemukan");
  }

  return peminjaman;
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

const returnBarang = async (id, buktiPengembalian) => {
  try {
    // Cek apakah peminjaman dengan ID tersebut ada
    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id },
    });

    if (!peminjaman) {
      throw new Error("Peminjaman tidak ditemukan");
    }

    // Update record peminjaman dengan status "DIKEMBALIKAN" dan bukti_pengembalian
    const updatedPeminjaman = await prisma.peminjaman.update({
      where: { id },
      data: {
        status: "DIKEMBALIKAN",
        bukti_pengembalian: buktiPengembalian, // Pastikan kolom ini sesuai dengan nama di database
      },
    });

    // Pastikan barangId ada di record peminjaman
    if (!peminjaman.barangId) {
      throw new Error("barangId tidak ditemukan pada peminjaman");
    }

    // Update barang agar status ketersediaannya kembali tersedia
    await prisma.barang.update({
      where: { id: peminjaman.barangId },
      data: { available: "Ya" },
    });

    // Kembalikan data peminjaman yang sudah diperbarui
    return updatedPeminjaman;
  } catch (error) {
    console.error("Error di returnBarang:", error.message);
    throw new Error("Gagal mengembalikan barang: " + error.message);
  }
};

// Example query in your service to fetch peminjaman with the associated barang name
const trackPeminjaman = async (userId) => {
  const peminjaman = await prisma.peminjaman.findMany({
    where: { userId },
    include: {
      barang: {
        // Include related barang data
        select: { name: true }, // Select only the 'name' field from barang
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
        select: { name: true }, // Select only the 'name' field from barang
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
        select: { name: true }, // Select the 'name' field from barang
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
