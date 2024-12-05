const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all categories
const getAllKategori = async () => {
  return await prisma.kategoriBarang.findMany();
};

module.exports = { getAllKategori };
