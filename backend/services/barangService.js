const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new barang
const addBarang = async ({ name, kategoriId, lokasi, kondisi, photo, available, jumlah }) => {
  const existingBarang = await prisma.aset.findFirst({
    where: { name },
  });

  if (existingBarang) {
    throw new Error("Nama barang sudah terdaftar, gunakan nama lain.");
  }

  // Jika kategori adalah "tempat", set jumlah ke 1 dan available ke "Ya"
  const selectedKategori = await prisma.kategoriAset.findUnique({
    where: { id: parseInt(kategoriId) },
  });

  const isTempat = selectedKategori.kategori.toLowerCase() === "tempat";

  const jumlahFinal = isTempat ? 1 : parseInt(jumlah);
  const availableFinal = isTempat ? "Ya" : "Ya";
  const kondisiFinal = isTempat ? "" : kondisi;
  const lokasiFinal = isTempat ? "" : lokasi;

  return prisma.aset.create({
    data: {
      name: name || "",
      kategoriId,
      jumlah: jumlahFinal,
      lokasi: lokasiFinal,
      kondisi: kondisiFinal,
      available: availableFinal,
      photo: photo || null,
    },
  });
};

const updateBarang = async (id, data) => {
  if (data.name) {
    const existingBarang = await prisma.aset.findFirst({
      where: {
        name: data.name,
        NOT: { id: id },
      },
    });

    if (existingBarang) {
      throw new Error("Nama barang sudah digunakan oleh barang lain.");
    }
  }

  // Jika kategori adalah "tempat", set jumlah ke 1 dan kondisi serta lokasi ke string kosong
  if (data.kategoriId) {
    const selectedKategori = await prisma.kategoriAset.findUnique({
      where: { id: parseInt(data.kategoriId) },
    });

    if (selectedKategori.kategori.toLowerCase() === "tempat") {
      data.jumlah = 1;
      data.kondisi = "";
      data.lokasi = "";
    }
  }

  return prisma.aset.update({
    where: { id: parseInt(id) },
    data,
  });
};
// Read all barang
const getAllBarang = async () =>
  prisma.aset.findMany({
    include: { kategori: true }, // Include kategori for more detailed response
  });

const getAvailableBarang = async (kategoriId) => {
  const filter = {
    available: "Ya", // Filter for available barang
  };

  // If kategoriId is provided, add it to the filter
  if (kategoriId) {
    filter.kategoriId = parseInt(kategoriId);
  }

  return prisma.aset.findMany({
    where: filter,
    include: { kategori: true }, // Include kategori for more detailed response
  });
};
// Read a single barang by ID
const getBarangById = async (id) =>
  prisma.aset.findUnique({
    where: { id: parseInt(id) },
    include: { kategori: true }, // Include kategori for detailed response
  });

// Delete a barang
const deleteBarang = async (id) => {
  // Hapus semua data yang terkait dengan barang ini terlebih dahulu
  await prisma.peminjaman.deleteMany({
    where: { barangId: parseInt(id) },
  });

  // Setelah itu, baru hapus barang
  return prisma.aset.delete({
    where: { id: parseInt(id) },
  });
};
const getBarangByKategoriBarang = async () => {
  return prisma.aset.findMany({
    where: {
      kategoriId: 1, // Filter by kategoriId = 1 (barang)
    },
    include: { kategori: true }, // Include kategori for more detailed response
  });
};

const getBarangByKategoriTempat = async () => {
  return prisma.aset.findMany({
    where: {
      kategoriId: 2, // Filter by kategoriId = 2 (tempat)
    },
    include: { kategori: true }, // Include kategori for more detailed response
  });
};

module.exports = {
  addBarang,
  getAvailableBarang,
  getAllBarang,
  getBarangById,
  updateBarang,
  deleteBarang,
  getBarangByKategoriBarang,
  getBarangByKategoriTempat,
};
