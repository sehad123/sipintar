"use client";
import React, { useState, useEffect } from "react";
import PengaduanFormModal from "../form/page";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProsedurPengaduan = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({ id: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (formData) => {
    try {
      const finalData = new FormData();
      finalData.append("kategori", formData.kategori);
      finalData.append("deskripsi", formData.deskripsi);
      finalData.append("photo", formData.photo);
      finalData.append("lokasi", formData.lokasi);
      finalData.append("userId", user.id);

      if (file) {
        finalData.append("bukti_persetujuan", file);
      }

      const response = await fetch("http://localhost:5000/api/pengaduan", {
        method: "POST",
        body: finalData,
      });

      if (response.ok) {
        toast.success("Pengajuan Pengaduan Berhasil ");
        handleCloseModal();
      } else {
        toast.error("Gagal untuk melakukan Pengajuan.");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Submission failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <ToastContainer />

      <header className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-800">Prosedur Pengaduan</h1>
        <p className="text-gray-500">Pastikan membaca instruksi sebelum melakukan Pengaduan</p>
      </header>

      <section className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mb-6">
        <ol className="list-decimal list-inside text-gray-700 space-y-4">
          <li>
            <span className="font-semibold">Mahasiswa / dosen / alumni</span> harus melakukan negosiasi terlebih dahulu melalui UPK.
          </li>
          <li>Setelah disetujui oleh UPK, isi formulir Pengaduan dan unggah bukti persetujuan.</li>
          <li>Pengaduan harus diajukan maksimal H-1 sebelum kegiatan.</li>
          <li>Pengaduan hanya berlaku sampai pukul 18.00 WIB.</li>
          <li>Pengaduan harus di luar jam perkuliahan.</li>
        </ol>
      </section>

      <button onClick={handleOpenModal} className="mt-4 bg-blue-500 text-white font-semibold py-2 px-6 rounded shadow hover:bg-blue-600 transition duration-200">
        Ajukan Pengaduan
      </button>

      <PengaduanFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} onFileChange={handleFileChange} />
    </div>
  );
};

export default ProsedurPengaduan;
