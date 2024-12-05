"use client";
import React, { useState, useEffect } from "react";

const PeminjamanFormModal = ({ isOpen, onClose, onSubmit, onFileChange }) => {
  const [kategori, setKategori] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [barang, setBarang] = useState([]);
  // const [user, setUser] = useState({ id: "" });
  const [user, setUser] = useState({ id: "", role: "" }); // Tambahkan role

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData((prevData) => ({
        ...prevData,

        userId: storedUser.id, // Set userId di formData
      }));
    }
  }, []);

  const [formData, setFormData] = useState({
    keperluan: "",
    nama_kegiatan: "",
    barangIds: [], // Array untuk menyimpan barang yang dipilih
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

    // Real-time validation for the current input field
    validateInput(name, value);
  };

  const handleBarangChange = (id) => {
    setFormData((prevData) => {
      const barangIds = prevData.barangIds.includes(id) ? prevData.barangIds.filter((barangId) => barangId !== id) : [...prevData.barangIds, id];
      return { ...prevData, barangIds };
    });
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      bukti_persetujuan: e.target.files[0], // Get the selected file
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
        errors.startDate = "Tanggal peminjaman tidak bisa hari ini. maksimal H-1";
      } else {
        errors.startDate = ""; // Clear error if valid
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
        errors.endDate = ""; // Clear error if valid
      }
    }

    if (name === "startTime") {
      const startHour = parseInt(value.split(":")[0]);
      if (startHour < 7) {
        errors.startTime = "Waktu mulai tidak boleh sebelum jam 7 pagi.";
      } else {
        errors.startTime = ""; // Clear error if valid
      }
    }

    if (name === "endTime") {
      const endHour = parseInt(value.split(":")[0]);
      if (endHour > 22) {
        errors.endTime = "Waktu berakhir tidak boleh setelah jam 10 malam.";
      } else {
        errors.endTime = ""; // Clear error if valid
      }
    }

    setValidationErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(validationErrors).some((error) => error)) {
      return; // Exit if there are validation errors
    }

    // Pastikan formData sudah mengandung userId yang diambil dari localStorage
    await onSubmit(formData); // Kirim formData dengan userId
    // onClose(); // Close the modal after submission

    // Menunda pengalihan halaman selama 5 detik (5000 ms)
    // setTimeout(() => {
    //   window.location.href = "/riwayat-peminjaman"; // Navigasi ke route riwayat peminjaman
    // }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} /> */}
      {/* <ToastContainer /> */}

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-8 right-2 text-gray-500 hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-1 text-center">Form Peminjaman</h2>
        <form onSubmit={handleSubmit}>
          {/* Existing form fields */}
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

          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">Barang atau Tempat:</label>
            {barang.map((item) => (
              <div key={item.id} className="flex items-center mb-2">
                <input type="checkbox" id={`barang-${item.id}`} value={item.id} checked={formData.barangIds.includes(item.id)} onChange={() => handleBarangChange(item.id)} className="mr-2" />
                <label htmlFor={`barang-${item.id}`}>{item.name}</label>
              </div>
            ))}
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
            <label className="block text-sm font-medium text-gray-700">Waktu Mulai:</label>
            <input type="time" name="startTime" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.startTime} onChange={handleChange} required />
            {validationErrors.startTime && <p className="text-red-500 text-xs">{validationErrors.startTime}</p>}
          </div>

          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">Waktu Selesai:</label>
            <input type="time" name="endTime" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.endTime} onChange={handleChange} required />
            {validationErrors.endTime && <p className="text-red-500 text-xs">{validationErrors.endTime}</p>}
          </div>

          {user.role !== "Dosen" && (
            <div className="mb-1">
              <label className="block text-sm font-medium text-gray-700">Bukti Persetujuan:</label>
              <input type="file" name="bukti_persetujuan" className="mt-1 block w-full border border-gray-300 rounded-md p-2" onChange={(e) => setFormData((prev) => ({ ...prev, bukti_persetujuan: e.target.files[0] }))} required />
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
