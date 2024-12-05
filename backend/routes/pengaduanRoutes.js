const express = require("express");
const multer = require("multer");
const {
  createPengaduan,
  approvePengaduan,
  rejectPengaduan,
  feedbackPengaduan,
  pencetNotifikasi,
  trackPengaduan,
  trackPengaduanNotifikasi,
  countJumlahPengaduan,
  getAllPengaduan,
  countPendingPengaduan,
  countPengaduanDisetujui,
  countPengaduanDitolak,
  countPengaduanSelesai,
  assignPelaksana,
  getAllPelaksana,
  countPendingPelaksana,
} = require("../services/pengaduanService");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Menyimpan file ke direktori 'uploads'

// Route untuk membuat pengaduan
router.post("/pengaduan", upload.single("photo"), async (req, res) => {
  const { userId, kategori, deskripsi, lokasi } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null; // Ambil path gambar

  try {
    const pengaduan = await createPengaduan({ userId, kategori, deskripsi, photo, lokasi });
    res.status(201).json(pengaduan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/pengaduan/assign_pelaksana", async (req, res) => {
  const { userId, pengaduanId } = req.body;

  try {
    const pengaduan = await assignPelaksana({ userId: parseInt(userId, 10), pengaduanId: parseInt(pengaduanId, 10) });
    res.status(201).json(pengaduan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/pengaduan/pelaksana", async (req, res) => {
  try {
    const pelaksanaList = await getAllPelaksana();
    res.status(200).json(pelaksanaList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.get("/pengaduan/pelaksana/:id", async (req, res) => {
//   try {
//     const pelaksanaList = await getAllPelaksana();
//     res.status(200).json(pelaksanaList);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Route untuk menyetujui pengaduan
router.put("/pengaduan/:id/approve", async (req, res) => {
  const { id } = req.params;
  const { catatan } = req.body;
  try {
    const pengaduan = await approvePengaduan(id, catatan);
    res.json(pengaduan);
  } catch (error) {
    res.status(500).json({ error: "Failed to approve pengaduan" });
  }
});

// Route untuk menolak pengaduan
router.put("/pengaduan/:id/reject", async (req, res) => {
  const { id } = req.params;
  const { catatan } = req.body;
  try {
    const pengaduan = await rejectPengaduan(id, catatan);
    res.json(pengaduan);
  } catch (error) {
    res.status(500).json({ error: "Failed to reject pengaduan" });
  }
});

// Route untuk memberikan tanggapan pada pengaduan (feedback)
router.put("/pengaduan/:id/feedback", async (req, res) => {
  const { id } = req.params;
  const { tanggapan } = req.body;
  try {
    const pengaduan = await feedbackPengaduan(parseInt(id), tanggapan);
    res.json(pengaduan);
  } catch (error) {
    res.status(500).json({ error: "Failed to give feedback on pengaduan" });
  }
});

// Route untuk menandai semua notifikasi sebagai dibaca
router.put("/pengaduan/user/:userId/notifikasi", async (req, res) => {
  const { userId } = req.params;
  try {
    const pengaduan = await pencetNotifikasi(parseInt(userId));
    res.json(pengaduan);
  } catch (error) {
    res.status(500).json({ error: "Failed to update notifications" });
  }
});

// Route untuk melacak pengaduan berdasarkan userId
router.get("/pengaduan/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const pengaduanHistory = await trackPengaduan(userId);
    res.json(pengaduanHistory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pengaduan history" });
  }
});

// Route untuk melacak notifikasi pengaduan
router.get("/pengaduan/user/:userId/notif", async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await trackPengaduanNotifikasi(userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pengaduan notifications" });
  }
});

// Route untuk mendapatkan jumlah pengaduan dengan notifikasi "Ya"
router.get("/pengaduan/user/:userId/count", async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const count = await countJumlahPengaduan(userId);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to count pengaduan with notifications" });
  }
});

// Route untuk mendapatkan semua pengaduan (admin)
router.get("/pengaduan", async (req, res) => {
  try {
    const pengaduanList = await getAllPengaduan();
    res.json(pengaduanList);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all pengaduan" });
  }
});

// Route untuk menghitung jumlah pengaduan dengan status "PENDING"
router.get("/pengaduan/count/pending", async (req, res) => {
  try {
    const pendingCount = await countPendingPengaduan();
    res.json({ pendingCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to count pending pengaduan" });
  }
});

// Route untuk menghitung jumlah pengaduan yang disetujui
router.get("/pengaduan/count/approved", async (req, res) => {
  try {
    const approvedCount = await countPengaduanDisetujui();
    res.json({ approvedCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to count approved pengaduan" });
  }
});

// Route untuk menghitung jumlah pengaduan yang ditolak
router.get("/pengaduan/count/rejected", async (req, res) => {
  try {
    const rejectedCount = await countPengaduanDitolak();
    res.json({ rejectedCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to count rejected pengaduan" });
  }
});

router.get("/pengaduan/count/onprogress", async (req, res) => {
  try {
    const onprogressCount = await countPengaduanDitolak();
    res.json({ onprogressCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to count rejected pengaduan" });
  }
});

router.get("/pengaduan/pelaksana/belum", async (req, res) => {
  try {
    const pelaksanaBelum = await countPendingPelaksana();
    res.json({ pelaksanaBelum });
  } catch (error) {
    res.status(500).json({ error: "Failed to count belum pelaksana" });
  }
});

// Route untuk menghitung jumlah pengaduan yang selesai (completed)
router.get("/pengaduan/count/completed", async (req, res) => {
  try {
    const completedCount = await countPengaduanSelesai();
    res.json({ completedCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to count completed pengaduan" });
  }
});

module.exports = router;
