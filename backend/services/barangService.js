const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new barang
const addBarang = async ({ name, kategoriId, lokasi, kondisi, photo, available }) => {
  // Check if the name already exists in the database
  const existingBarang = await prisma.barang.findFirst({
    where: { name },
  });

  if (existingBarang) {
    throw new Error("Nama barang sudah terdaftar, gunakan nama lain.");
  }

  // Create a new barang
  return prisma.barang.create({
    data: {
      name: name || "",
      kategoriId,
      lokasi: lokasi || "",
      kondisi: kondisi || "",
      available: available || "",
      photo: photo || null,
    },
  });
};

const updateBarang = async (id, data) => {
  if (data.name) {
    const existingBarang = await prisma.barang.findFirst({
      where: {
        name: data.name,
        NOT: { id: id }, // Ensure we're not checking against the same barang
      },
    });

    if (existingBarang) {
      throw new Error("Nama barang sudah digunakan oleh barang lain.");
    }
  }

  return prisma.barang.update({
    where: { id: parseInt(id) },
    data,
  });
};

// Read all barang
const getAllBarang = async () =>
  prisma.barang.findMany({
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

  return prisma.barang.findMany({
    where: filter,
    include: { kategori: true }, // Include kategori for more detailed response
  });
};
// Read a single barang by ID
const getBarangById = async (id) =>
  prisma.barang.findUnique({
    where: { id: parseInt(id) },
    include: { kategori: true }, // Include kategori for detailed response
  });

// Delete a barang
const deleteBarang = async (id) =>
  prisma.barang.delete({
    where: { id: parseInt(id) },
  });

module.exports = { addBarang, getAvailableBarang, getAllBarang, getBarangById, updateBarang, deleteBarang };
