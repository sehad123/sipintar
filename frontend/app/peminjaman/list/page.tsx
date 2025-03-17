"use client";
import React, { useState, useEffect } from "react";
import PeminjamanFormModal from "../form/page";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProsedurPeminjaman = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({ id: "", role: "" });

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
    const formDataToSend = new FormData();
    formDataToSend.append("userId", formData.userId);
    formDataToSend.append("barangIds", JSON.stringify(formData.barangIds));
    formDataToSend.append("keperluan", formData.keperluan);
    formDataToSend.append("nama_kegiatan", formData.nama_kegiatan);
    formDataToSend.append("startDate", formData.startDate);
    formDataToSend.append("endDate", formData.endDate);
    formDataToSend.append("startTime", formData.startTime);
    formDataToSend.append("endTime", formData.endTime);
    formDataToSend.append("bukti_persetujuan", formData.bukti_persetujuan);
    formDataToSend.append("jumlahBarang", formData.jumlahBarang);

    try {
      const response = await fetch("http://localhost:5000/api/peminjaman", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Error submitting form:", result);
        toast.error(`Error: ${result.error}`);

        if (result.error.includes("sudah diajukan pengguna lain")) {
          formData.barangIds = [];
        }
      } else {
        toast.success("Peminjaman berhasil diajukan!");

        setTimeout(() => {
          window.location.href = "/riwayat-peminjaman";
        }, 1000);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim data.");
      console.error("Error submitting form:", error);
    }
  };

  // Komponen Roadmap Alur
  const RoadmapStep = ({ number, children }) => (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">{number}</div>
      <div>
        <p className="text-gray-700">{children}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <ToastContainer />

      <header className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-800 md:hidden">Prosedur Peminjaman</h1>
        <p className="text-gray-500">Pastikan membaca instruksi sebelum melakukan peminjaman</p>
      </header>

      {/* Tampilan Mobile: Roadmap Alur */}
      <section className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mb-6 md:hidden">
        <div className="space-y-8 relative">
          {/* Garis vertikal */}
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-300"></div>

          {user.role === "Mahasiswa" ? (
            <>
              <RoadmapStep number="1">Mahasiswa harus melakukan negosiasi terlebih dahulu melalui UPK.</RoadmapStep>
              <RoadmapStep number="2">Peminjaman ruang Kelas, harus di luar jam perkuliahan.</RoadmapStep>
              <RoadmapStep number="3">Mahasiswa harus melakukan perizinan dari BAAK untuk peminjaman kelas di jam perkuliahan.</RoadmapStep>
              <RoadmapStep number="3">Setelah disetujui oleh UPK, isi formulir peminjaman dan unggah bukti persetujuan.</RoadmapStep>
              <RoadmapStep number="4">Peminjaman harus diajukan maksimal H-1 sebelum kegiatan.</RoadmapStep>
              <RoadmapStep number="2">Peminjaman hanya berlaku sampai pukul 18.00 WIB.</RoadmapStep>
            </>
          ) : (
            <>
              <RoadmapStep number="1">Peminjaman harus diajukan maksimal H-1 sebelum kegiatan.</RoadmapStep>
              <RoadmapStep number="2">Peminjaman hanya berlaku sampai pukul 18.00 WIB.</RoadmapStep>
              <RoadmapStep number="3">Untuk peminjaman ruangan, harus di luar jam perkuliahan.</RoadmapStep>
            </>
          )}
        </div>
      </section>

      {/* Tampilan Desktop: Gambar Roadmap */}
      <section className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl h-[100px] -mt-20 hidden md:block">
        <h1 className="text-4xl font-semibold text-gray-800 text-center ">Prosedur Peminjaman</h1>
        <p className="text-gray-500 text-center">Pastikan membaca instruksi sebelum melakukan peminjaman</p>{" "}
        {user.role === "Mahasiswa" ? (
          <>
            <img src="/img/roadmap_fix.png" alt="Prosedur Peminjaman" className=" -mt-24 w-full h-auto object-cover rounded-lg" style={{ clipPath: "inset(3.5cm 0 2cm 0)" }} />
          </>
        ) : (
          <>
            <img src="/img/roadmap_dosen.png" alt="Prosedur Peminjaman" className=" -mt-24 w-full h-auto object-cover rounded-lg" style={{ clipPath: "inset(3.5cm 0 2cm 0)" }} />
          </>
        )}
      </section>

      {/* Tabel Barang */}

      {/* Tombol Ajukan Peminjaman */}
      <button onClick={handleOpenModal} className="-mt-15 md:mt-[380px]   bg-blue-500 text-white font-semibold py-2 px-6 rounded shadow hover:bg-blue-600 transition duration-200">
        Ajukan Peminjaman
      </button>

      <PeminjamanFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} onFileChange={handleFileChange} />
    </div>
  );
};

export default ProsedurPeminjaman;
