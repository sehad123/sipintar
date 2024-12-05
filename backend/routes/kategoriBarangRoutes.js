const express = require("express");
const { getAllKategori } = require("../services/kategoriBarangService");
const router = express.Router();
const asyncHandler = require("express-async-handler");

// Get all categories
router.get(
  "/kategori",
  asyncHandler(async (req, res) => {
    const kategori = await getAllKategori();
    res.json(kategori);
  })
);

module.exports = router;
