"use client";
import React, { useState, useEffect } from "react";
import PeminjamanFormModal from "../form/page";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProsedurPeminjaman = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({ id: "", role: "" });
  const [barangList, setBarangList] = useState([]);
  const [filteredBarangList, setFilteredBarangList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchBarangList = async () => {
      try {
        const [barangRes, categoriesRes] = await Promise.all([fetch("http://localhost:5000/api/barang"), fetch("http://localhost:5000/api/kategori")]);

        if (!barangRes.ok || !categoriesRes.ok) throw new Error("HTTP error!");

        const barangData = await barangRes.json();
        const categoriesData = await categoriesRes.json();

        setBarangList(barangData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching barang or categories:", error.message);
        setError("Failed to fetch data. Please try again later.");
      }
    };
    fetchBarangList();
  }, []);

  useEffect(() => {
    // Filter barang based on search input
    const filteredList = barangList.filter((barang) => barang.name.toLowerCase().includes(searchName.toLowerCase()));
    setFilteredBarangList(filteredList);
    setCurrentPage(1);
  }, [searchName, barangList]);

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

  const totalPages = Math.ceil(filteredBarangList.length / itemsPerPage);
  const paginatedBarangList = filteredBarangList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.kategori : "Unknown";
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

    try {
      const response = await fetch("http://localhost:5000/api/peminjaman", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Error submitting form:", result);
        toast.error(`Error: ${result.error}`); // Menampilkan toast error

        // Hanya reset kolom barang/tempat (barangIds) jika error terkait barang yang sedang diajukan
        if (result.error.includes("sudah diajukan pengguna lain")) {
          formData.barangIds = []; // Reset barangIds
        }
      } else {
        toast.success("Peminjaman berhasil diajukan!");

        setTimeout(() => {
          window.location.href = "/riwayat-peminjaman"; // Navigasi ke route riwayat peminjaman
        }, 1000);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim data.");
      console.error("Error submitting form:", error);
    }
  };
  const isBarangUnavailable = () => {
    // Check if any barang in the filtered list is unavailable
    return searchName && filteredBarangList.some((barang) => barang.name.toLowerCase().includes(searchName.toLowerCase()) && barang.available === "Tidak");
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <ToastContainer />

      <header className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-800">Prosedur Peminjaman</h1>
        <p className="text-gray-500">Pastikan membaca instruksi sebelum melakukan peminjaman</p>
      </header>
      <section className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mb-6">
        {user.role === "Mahasiswa" ? (
          <ol className="list-decimal list-inside text-gray-700 space-y-4">
            <li>
              <span className="font-semibold">Mahasiswa</span> harus melakukan negosiasi terlebih dahulu melalui UPK.
            </li>
            <li>Setelah disetujui oleh UPK, isi formulir peminjaman dan unggah bukti persetujuan.</li>
            <li>Peminjaman harus diajukan maksimal H-1 sebelum kegiatan.</li>
            <li>Peminjaman hanya berlaku sampai pukul 18.00 WIB.</li>
            <li>Untuk Peminjaman Ruangan harus di luar jam perkuliahan.</li>
          </ol>
        ) : (
          <ol className="list-decimal list-inside text-gray-700 space-y-4">
            <li>Peminjaman harus diajukan maksimal H-1 sebelum kegiatan.</li>
            <li>Peminjaman hanya berlaku sampai pukul 18.00 WIB.</li>
            <li>Untuk Peminjaman Ruangan harus di luar jam perkuliahan.</li>
          </ol>
        )}
      </section>

      <section className="w-full max-w-2xl mb-6">
        <input type="text" placeholder="Cari nama barang atau tempat ..." value={searchName} onChange={(e) => setSearchName(e.target.value)} className="w-full p-3 border rounded-md shadow-sm" />
      </section>

      <section className="container mx-auto p-4 mb-8 w-full max-w-4xl">
        {searchName && isBarangUnavailable() ? (
          <p className="text-red-500 text-center mt-4">Barang saat ini sedang tidak tersedia</p>
        ) : (
          searchName &&
          filteredBarangList.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-200 text-gray-600">
                    <th className="border p-4 text-left">Nama Barang</th>
                    <th className="border p-4 text-center">Foto</th>
                    <th className="border p-4 text-left">Kondisi</th>
                    <th className="border p-4 text-left">Lokasi</th>
                    <th className="border p-4 text-left">Kategori</th>
                    {/* <th className="border p-4 text-left">Tersedia</th> */}
                  </tr>
                </thead>
                <tbody>
                  {paginatedBarangList.map((barang) => (
                    <tr key={barang.id} className="hover:bg-gray-100">
                      <td className="border p-4">{barang.name}</td>
                      <td className="border p-4 text-center">{barang.photo ? <img src={`http://localhost:5000${barang.photo}`} alt={barang.name} className="w-20 h-20 object-cover rounded-lg mx-auto" /> : "No Image"}</td>
                      <td className="border p-4">{barang.kondisi}</td>
                      <td className="border p-4">{barang.lokasi}</td>
                      <td className="border p-4">{getCategoryName(barang.kategoriId)}</td>
                      {/* <td className="border p-4">{barang.available}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </section>

      <button onClick={handleOpenModal} className="mt-4 bg-blue-500 text-white font-semibold py-2 px-6 rounded shadow hover:bg-blue-600 transition duration-200">
        Ajukan Peminjaman
      </button>

      <PeminjamanFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} onFileChange={handleFileChange} />
    </div>
  );
};

export default ProsedurPeminjaman;
