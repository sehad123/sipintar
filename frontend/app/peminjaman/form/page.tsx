"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const PeminjamanFormModal = ({ isOpen, onClose, onSubmit, selectedBarang, showJumlah }) => {
  const [kategori, setKategori] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState(selectedBarang?.kategoriId || "");
  const [barang, setBarang] = useState([]);
  const [user, setUser] = useState({ id: "", role: "" });
  const [jumlahBarang, setJumlahBarang] = useState(1); // Default jumlah barang adalah 1

  const [formData, setFormData] = useState({
    keperluan: "",
    nama_kegiatan: "",
    barangIds: selectedBarang ? [selectedBarang.id] : [],
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    bukti_persetujuan: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (selectedBarang) {
      setSelectedKategori(selectedBarang.kategoriId); // Set kategori berdasarkan selectedBarang
      setFormData((prevData) => ({
        ...prevData,
        barangIds: [selectedBarang.id], // Set barangIds dengan id barang yang dipilih
      }));
    }
  }, [selectedBarang]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData((prevData) => ({
        ...prevData,
        userId: storedUser.id,
      }));
    }
  }, []);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/kategori");
        const data = await response.json();
        setKategori(data);
      } catch (error) {
        console.error("Error fetching kategori:", error);
      }
    };

    fetchKategori();
  }, []);

  useEffect(() => {
    if (selectedKategori) {
      const fetchBarang = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/barangtersedia?kategoriId=${selectedKategori}`);
          const data = await response.json();
          setBarang(data);
        } catch (error) {
          console.error("Error fetching barang:", error);
        }
      };

      fetchBarang();
    } else {
      setBarang([]);
    }
  }, [selectedKategori]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    validateInput(name, value);
  };

  const handleBarangChange = (id) => {
    setFormData((prevData) => {
      const barangIds = prevData.barangIds.includes(id) ? prevData.barangIds.filter((barangId) => barangId !== id) : [...prevData.barangIds, id];
      return { ...prevData, barangIds };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Validasi ukuran file (maksimal 2MB)
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file tidak boleh lebih dari 2MB.");
      e.target.value = ""; // Reset input file
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      bukti_persetujuan: file,
    }));
  };

  const validateInput = (name, value) => {
    let errors = { ...validationErrors };
    const today = new Date();

    if (name === "startDate") {
      const startDate = new Date(value);
      if (startDate < today) {
        errors.startDate = "Tanggal peminjaman tidak bisa sebelum hari ini.";
      } else if (startDate.toDateString() === today.toDateString()) {
        errors.startDate = "Tanggal peminjaman tidak bisa hari ini. Maksimal H-1.";
      } else {
        errors.startDate = "";
      }
    }

    if (name === "endDate") {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(value);
      const maxEndDate = new Date(startDate);
      maxEndDate.setDate(startDate.getDate() + 10);

      if (endDate > maxEndDate) {
        errors.endDate = "Tanggal pengembalian maksimal 10 hari dari tanggal peminjaman.";
      } else if (endDate < startDate) {
        errors.endDate = "Tanggal pengembalian tidak bisa mendahului tanggal peminjaman.";
      } else {
        errors.endDate = "";
      }
    }

    if (name === "startTime") {
      const startHour = parseInt(value.split(":")[0]);
      if (startHour < 7) {
        errors.startTime = "Waktu mulai tidak boleh sebelum jam 7 pagi.";
      } else {
        errors.startTime = "";
      }
    }

    if (name === "endTime") {
      const endHour = parseInt(value.split(":")[0]);
      if (endHour > 22) {
        errors.endTime = "Waktu berakhir tidak boleh setelah jam 10 malam.";
      } else {
        errors.endTime = "";
      }
    }

    setValidationErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi jumlah barang hanya untuk kategori barang
    if (selectedKategori === "1") {
      // Ganti "1" dengan ID kategori barang
      const barangDipinjam = barang.find((item) => item.id === formData.barangIds[0]);
      if (barangDipinjam && jumlahBarang > barangDipinjam.jumlah) {
        toast.error(`Jumlah barang yang dipinjam melebihi stok yang tersedia (${barangDipinjam.jumlah})`);
        return;
      }
    }

    // Lanjutkan proses submit jika validasi berhasil
    await onSubmit({ ...formData, jumlahBarang });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-8 right-2 text-gray-500 hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-1 text-center">Form Peminjaman</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">Kategori:</label>
            <select className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={selectedKategori} onChange={(e) => setSelectedKategori(e.target.value)} required>
              <option value="">Pilih Kategori</option>
              {kategori.map((kat) => (
                <option key={kat.id} value={kat.id}>
                  {kat.kategori}
                </option>
              ))}
            </select>
          </div>

          {/* Daftar Barang Secara Horizontal */}
          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">Barang atau Tempat:</label>
            <div className="flex flex-wrap max-h-24 overflow-y-auto border border-gray-300 rounded-md p-2">
              {barang.map((item) => (
                <div key={item.id} className="flex items-center mr-4 mb-2">
                  <input
                    type="checkbox"
                    id={`barang-${item.id}`}
                    value={item.id}
                    checked={formData.barangIds.includes(item.id)}
                    onChange={() => handleBarangChange(item.id)}
                    className="mr-2"
                    disabled={selectedBarang && item.id !== selectedBarang.id}
                  />
                  <label htmlFor={`barang-${item.id}`}>{item.name}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Tampilkan kolom jumlah hanya jika showJumlah bernilai true */}
          {showJumlah &&
            selectedKategori !== "2" && ( // Ganti "1" dengan ID kategori barang
              <div className="mb-1">
                <label className="block text-sm font-medium text-gray-700">Jumlah:</label>
                <input
                  type="number"
                  name="jumlahBarang"
                  value={jumlahBarang}
                  onChange={(e) => setJumlahBarang(Math.max(1, e.target.value))} // Pastikan jumlah minimal 1
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  min="1"
                  required
                />
              </div>
            )}

          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">Keperluan:</label>
            <select name="keperluan" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.keperluan} onChange={handleChange} required>
              <option value="">Pilih Keperluan</option>
              <option value="Akademik">Akademik</option>
              <option value="Non Akademik">Non Akademik</option>
            </select>
          </div>

          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">Nama Kegiatan</label>
            <input type="text" name="nama_kegiatan" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.nama_kegiatan} onChange={handleChange} required />
          </div>

          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">Tanggal Peminjaman:</label>
            <input type="date" name="startDate" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.startDate} onChange={handleChange} required />
            {validationErrors.startDate && <p className="text-red-500 text-xs">{validationErrors.startDate}</p>}
          </div>

          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">Tanggal Pengembalian:</label>
            <input type="date" name="endDate" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.endDate} onChange={handleChange} required />
            {validationErrors.endDate && <p className="text-red-500 text-xs">{validationErrors.endDate}</p>}
          </div>

          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">Jam Mulai Peminjaman:</label>
            <input type="time" name="startTime" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.startTime} onChange={handleChange} required />
            {validationErrors.startTime && <p className="text-red-500 text-xs">{validationErrors.startTime}</p>}
          </div>

          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">Jam Selesai Peminjaman:</label>
            <input type="time" name="endTime" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.endTime} onChange={handleChange} required />
            {validationErrors.endTime && <p className="text-red-500 text-xs">{validationErrors.endTime}</p>}
          </div>

          {user.role !== "Dosen" && user.role !== "Alumni" && (
            <div className="mb-1">
              <label className="block text-sm font-medium text-gray-700">Bukti Persetujuan UPK:</label>
              <input type="file" name="bukti_persetujuan" className="mt-1 block w-full border border-gray-300 rounded-md p-2" onChange={handleFileChange} required />
            </div>
          )}

          <div className="flex justify-end">
            <button type="button" className="mr-2 bg-gray-300 text-gray-700 py-1 px-4 rounded-md" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="bg-blue-500 text-white py-1 px-4 rounded-md">
              Kirim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PeminjamanFormModal;
