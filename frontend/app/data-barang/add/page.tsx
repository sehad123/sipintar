"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddBarangModal({ onClose, onSave }) {
  const [newBarang, setNewBarang] = useState({
    name: "",
    kategoriId: "",
    kondisi: "",
    lokasi: "",
    available: "",
    photo: null,
  });

  const [kategoriList, setKategoriList] = useState([]);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/kategori");
        const data = await response.json();
        setKategoriList(data);
      } catch (error) {
        console.error("Failed to fetch kategori:", error);
      }
    };

    fetchKategori();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBarang((prevBarang) => ({ ...prevBarang, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Validasi tipe file
    if (file && !file.type.startsWith("image/")) {
      toast.error("File yang diupload harus berupa gambar.");
      e.target.value = ""; // Reset input file
      return;
    }

    // Validasi ukuran file (maksimal 2MB)
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file tidak boleh lebih dari 2MB.");
      e.target.value = ""; // Reset input file
      return;
    }

    setNewBarang((prevBarang) => ({ ...prevBarang, photo: file }));
  };

  const handleSave = () => {
    // Validasi jika foto belum diupload
    if (!newBarang.photo) {
      toast.error("Harap upload foto barang.");
      return;
    }

    const formData = new FormData();
    Object.keys(newBarang).forEach((key) => {
      formData.append(key, newBarang[key]);
    });
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Formulir Penambahan Barang</h2>
        <label className="block mb-2">Kategori</label>
        <select name="kategoriId" value={newBarang.kategoriId} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded">
          <option value="" disabled>
            Pilih Kategori
          </option>
          {kategoriList.map((kategori) => (
            <option key={kategori.id} value={kategori.id}>
              {kategori.kategori}
            </option>
          ))}
        </select>
        <div className="mb-4 mt-2">
          <label className="block mb-2">Nama</label>
          <input type="text" name="name" value={newBarang.name} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Kondisi</label>
          <input type="text" name="kondisi" value={newBarang.kondisi} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Lokasi</label>
          <input type="text" name="lokasi" value={newBarang.lokasi} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div className="mb-4">
          <select name="available" value={newBarang.available} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded">
            <option value="" disabled>
              Pilih Ketersediaan
            </option>
            <option value="Ya">Ya</option>
            <option value="Tidak">Tidak</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Foto</label>
          <input
            type="file"
            required
            name="photo"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
            accept="image/*" // Hanya menerima file gambar
          />
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">
            Batal
          </button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
