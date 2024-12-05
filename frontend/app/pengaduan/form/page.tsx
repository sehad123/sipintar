"use client";
import React, { useState, useEffect } from "react";

const PengaduanFormModal = ({ isOpen, onClose, onSubmit, onFileChange }) => {
  const [user, setUser] = useState({ id: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData((prevData) => ({
        ...prevData,
        userId: parseInt(storedUser.id, 10), // Konversi userId menjadi Int
      }));
    }
  }, []);

  const [formData, setFormData] = useState({
    kategori: "",
    deskripsi: "",
    photo: "",
    lokasi: "", // Tambahkan lokasi
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      photo: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pastikan formData sudah mengandung userId dan lokasi yang valid
    const completeData = {
      ...formData,
      userId: user.id, // pastikan userId sudah di-set di sini
      lokasi: formData.lokasi, // pastikan lokasi termasuk dalam data yang dikirim
    };

    await onSubmit(completeData); // Kirim data lengkap dengan lokasi dan userId
    onClose();

    setTimeout(() => {
      window.location.href = "/riwayat-pengaduan";
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-8 right-2 text-gray-500 hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-1 text-center">Form Pengaduan</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">Keperluan:</label>
            <select name="kategori" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.kategori} onChange={handleChange} required>
              <option value="">Pilih Kategori</option>
              <option value="Kehilangan">Kehilangan</option>
              <option value="Kerusakan">Kerusakan</option>
              <option value="Pengadaan">Pengadaan</option>
            </select>
          </div>

          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">Lokasi</label>
            <input type="text" name="lokasi" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.lokasi} onChange={handleChange} required />
          </div>

          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">Keterangan Gambar:</label>
            <input type="file" className="mt-1 block w-full border border-gray-300 rounded-md p-2" onChange={handleFileChange} />
          </div>

          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea name="deskripsi" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.deskripsi} onChange={handleChange} required rows="4"></textarea>
          </div>

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

export default PengaduanFormModal;
