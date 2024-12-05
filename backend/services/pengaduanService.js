const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Service untuk membuat pengaduan
const createPengaduan = async ({ userId, kategori, deskripsi, photo, lokasi }) => {
  const currentTime = new Date();
  const jam = `${currentTime.getHours().toString().padStart(2, "0")}:${currentTime.getMinutes().toString().padStart(2, "0")}`;

  try {
    const pengaduan = await prisma.pengaduan.create({
      data: {
        userId: parseInt(userId, 10), // Konversi userId menjadi Int
        kategori,
        jam,
        deskripsi,
        date: currentTime,
        photo,
        lokasi,
        status: "PENDING",
        catatan: "",
        tanggapan: "",
        notifikasi: "",
      },
    });
    return pengaduan;
  } catch (error) {
    console.error("Error creating pengaduan:", error);
    throw new Error("Internal Server Error. Failed to create pengaduan.");
  }
};

const assignPelaksana = async ({ userId, pengaduanId }) => {
  const parsedPengaduanId = parseInt(pengaduanId, 10);
  const parsedUserId = parseInt(userId, 10);

  try {
    // First, create the pelaksana record
    const pelaksana = await prisma.pelaksana.create({
      data: {
        userId: parsedUserId, // Konversi userId menjadi Int
        pengaduanId: parsedPengaduanId,
        tgl_selesai: null,
        is_selesai: "Belum",
      },
    });

    // Then, update the pengaduan status
    await prisma.pengaduan.update({
      where: { id: parsedPengaduanId }, // Using pengaduanId as the id
      data: { status: "ONPROGGRESS" },
    });

    return pelaksana; // Return pelaksana after both actions are complete
  } catch (error) {
    console.error("Error assigning pelaksana:", error);
    throw new Error("Internal Server Error. Failed to assign pelaksana.");
  }
};

const getAllPelaksana = async () => {
  return await prisma.pelaksana.findMany({
    include: {
      pengaduan: {
        select: { deskripsi: true, kategori: true },
      },
      user: {
        select: { name: true, no_hp: true, email: true },
      },
    },
    orderBy: {
      tgl_penugasan: "desc",
    },
  });
};

// const updateTugasPelaksana = async (id) => {
//   return await prisma.pengaduan.update({
//     where: { id: parseInt(id) },
//     data: {
//       is_selesai: "Sudah",
//       tgl_selesai: new Date() // Menggunakan tanggal dan waktu saat ini
//     },
//   });
// };

// Service untuk menyetujui pengaduan
const approvePengaduan = async (id, catatan) => {
  return await prisma.pengaduan.update({
    where: { id: parseInt(id) },
    data: { status: "APPROVED", catatan: catatan, notifikasi: "Ya" },
  });
};

const rejectPengaduan = async (id, catatan) => {
  return await prisma.pengaduan.update({
    where: { id: parseInt(id) },
    data: { status: "REJECTED", catatan: catatan, notifikasi: "Ya" },
  });
};

const feedbackPengaduan = async (id, tanggapan) => {
  try {
    // Cek apakah pengaduan dengan ID tersebut ada
    const pengaduan = await prisma.pengaduan.findUnique({
      where: { id },
    });

    if (!pengaduan) {
      throw new Error("Pengaduan tidak ditemukan");
    }

    // Menggunakan transaksi untuk melakukan dua update sekaligus
    const result = await prisma.$transaction([
      // Update tabel pengaduan untuk menambahkan tanggapan dan mengubah status
      prisma.pengaduan.update({
        where: { id },
        data: {
          status: "COMPLETED", // Mengubah status pengaduan
          tanggapan: tanggapan, // Menambahkan tanggapan
        },
      }),

      // Update tabel pelaksana untuk menandai tugas selesai
      prisma.pelaksana.updateMany({
        where: { pengaduanId: parseInt(id) }, // Menggunakan pengaduanId untuk mencari pelaksana yang sesuai
        data: {
          is_selesai: "Sudah", // Menandai bahwa tugas sudah selesai
          tgl_selesai: new Date(), // Menggunakan tanggal dan waktu saat ini
        },
      }),
    ]);

    // Mengembalikan hasil dari transaksi
    return result;
  } catch (error) {
    // Menangani error
    console.error("Error updating pengaduan and pelaksana:", error);
    throw new Error("Gagal memberikan feedback pada pengaduan.");
  }
};

const pencetNotifikasi = async (userId) => {
  // Mengupdate semua data pengaduan yang memiliki userId yang sama dan mengubah status notifikasi menjadi "Tidak"
  const pengaduan = await prisma.pengaduan.updateMany({
    where: { userId }, // Mencari semua pengaduan dengan userId yang sesuai
    data: { notifikasi: "Tidak" }, // Mengubah nilai kolom 'notifikasi' menjadi "Tidak"
  });

  // Mengecek apakah ada perubahan yang terjadi
  if (pengaduan.count === 0) {
    throw new Error("Tidak ada pengaduan yang ditemukan untuk user ini");
  }

  return pengaduan;
};
// Service untuk melacak pengaduan berdasarkan userId
const trackPengaduan = async (userId) => {
  return await prisma.pengaduan.findMany({
    where: { userId: parseInt(userId) },
    orderBy: { createdAt: "desc" }, // Urutkan berdasarkan tanggal terbaru
  });
};

const trackPengaduanNotifikasi = async (userId) => {
  return await prisma.pengaduan.findMany({
    where: { userId: parseInt(userId), notifikasi: "Ya" },
    orderBy: { createdAt: "desc" }, // Urutkan berdasarkan tanggal terbaru
  });
};

const countJumlahPengaduan = async (userId) => {
  try {
    const count = await prisma.pengaduan.count({
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
    throw new Error("Gagal menghitung pengaduan dengan catatan: " + error.message);
  }
};

const getAllPengaduan = async () => {
  const pengaduanList = await prisma.pengaduan.findMany({
    include: {
      user: {
        select: { name: true, email: true, role: true }, // Select the 'name' and 'email' fields from the user
      },
    },
    orderBy: {
      createdAt: "desc", // Mengurutkan berdasarkan 'createdAt' secara menurun
    },
  });

  if (!pengaduanList.length) {
    throw new Error("Belum ada data pengaduan");
  }

  return pengaduanList;
};

const countPendingPengaduan = async () => {
  const pendingCount = await prisma.pengaduan.count({
    where: {
      status: "PENDING",
    },
  });

  return pendingCount;
};

const countPendingPelaksana = async () => {
  const pendingCount = await prisma.pelaksana.count({
    where: {
      is_selesai: "Belum",
    },
  });

  return pendingCount;
};

const countPengaduanDisetujui = async () => {
  const pendingCount = await prisma.pengaduan.count({
    where: {
      status: "APPROVED",
    },
  });

  return pendingCount;
};

const countPengaduanOnprogress = async () => {
  const pendingCount = await prisma.pengaduan.count({
    where: {
      status: "ONPROGGRESS",
    },
  });

  return pendingCount;
};

const countPengaduanDitolak = async () => {
  const pendingCount = await prisma.pengaduan.count({
    where: {
      status: "REJECTED",
    },
  });

  return pendingCount;
};

const countPengaduanSelesai = async () => {
  const pendingCount = await prisma.pengaduan.count({
    where: {
      status: "COMPLETED",
    },
  });

  return pendingCount;
};

module.exports = {
  createPengaduan,
  rejectPengaduan,
  pencetNotifikasi,
  feedbackPengaduan,
  trackPengaduanNotifikasi,
  countJumlahPengaduan,
  getAllPengaduan,
  countPendingPengaduan,
  countPengaduanDisetujui,
  countPengaduanDitolak,
  countPengaduanSelesai,
  approvePengaduan,
  trackPengaduan,
  assignPelaksana,
  getAllPelaksana,
  countPendingPelaksana,
  countPengaduanOnprogress,
};
