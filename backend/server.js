const express = require("express");
const cors = require("cors");
const path = require("path"); // Perlu untuk mengatur path

const userRoutes = require("./routes/userRoutes");
const barangRoutes = require("./routes/barangRoutes");
const peminjamanRoutes = require("./routes/peminjamanRoutes");
const kategoriBarangRoutes = require("./routes/kategoriBarangRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Use the routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", userRoutes);
app.use("/api", barangRoutes);
app.use("/api", peminjamanRoutes);
app.use("/api", kategoriBarangRoutes); // Tambahkan route pengaduan

// Server listening
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
