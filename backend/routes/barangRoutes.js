const express = require("express");
const { addBarang, getAllBarang, getAvailableBarang, getBarangById, updateBarang, deleteBarang, getBarangByKategoriBarang, getBarangByKategoriTempat } = require("../services/barangService");
const upload = require("../utils/multerSetup"); // Import multer setup
const router = express.Router();
const asyncHandler = require("express-async-handler"); // For async error handling

// Route for adding barang (with photo upload)
router.post(
  "/barang/add",
  upload.single("photo"),
  asyncHandler(async (req, res) => {
    const { name, kategoriId, lokasi, kondisi, available } = req.body; // Ensure `kategoriId` is included
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null; // Prefix with "/uploads/"

    try {
      const barang = await addBarang({
        name,
        kategoriId: parseInt(kategoriId), // Convert to integer
        lokasi,
        kondisi,
        photo: photoPath, // Store relative URL for the image
        available,
      });
      res.json(barang);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
);

router.patch(
  "/barang/:id",
  upload.single("photo"),
  asyncHandler(async (req, res) => {
    const { name, kategoriId, lokasi, kondisi, available } = req.body; // Ensure `kategoriId` is included
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const updatedData = {};
    if (name) updatedData.name = name;
    if (kategoriId) updatedData.kategoriId = parseInt(kategoriId); // Convert to integer
    if (lokasi) updatedData.lokasi = lokasi;
    if (kondisi) updatedData.kondisi = kondisi;
    if (available) updatedData.available = available;
    if (photoPath) updatedData.photo = photoPath;

    const barangId = parseInt(req.params.id);

    try {
      const updatedBarang = await updateBarang(barangId, updatedData);
      res.json(updatedBarang);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
);

// Get all barang
router.get(
  "/barang",
  asyncHandler(async (req, res) => {
    const barang = await getAllBarang();
    res.json(barang);
  })
);

router.get(
  "/barang/barang",
  asyncHandler(async (req, res) => {
    const barang = await getBarangByKategoriBarang();
    res.json(barang);
  })
);

// Get all barang with kategori "tempat"
router.get(
  "/barang/tempat",
  asyncHandler(async (req, res) => {
    const barang = await getBarangByKategoriTempat();
    res.json(barang);
  })
);

router.get(
  "/barangtersedia",
  asyncHandler(async (req, res) => {
    const kategoriId = req.query.kategoriId; // Get kategoriId from query parameters
    const barang = await getAvailableBarang(kategoriId); // Pass kategoriId to the function
    res.json(barang);
  })
);

// Get a barang by ID
router.get(
  "/barang/:id",
  asyncHandler(async (req, res) => {
    const barang = await getBarangById(req.params.id);
    if (!barang) {
      return res.status(404).json({ error: "Barang not found" });
    }
    res.json(barang);
  })
);

// Delete a barang by ID
router.delete(
  "/barang/:id",
  asyncHandler(async (req, res) => {
    await deleteBarang(req.params.id);
    res.json({ message: "Barang deleted successfully" });
  })
);

module.exports = router;
