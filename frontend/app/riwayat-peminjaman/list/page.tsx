"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PeminjamanList = ({ userId }) => {
  const [peminjaman, setPeminjaman] = useState([]);
  const [filteredPeminjaman, setFilteredPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeminjamanId, setSelectedPeminjamanId] = useState(null);
  const [buktiPengembalian, setBuktiPengembalian] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fungsi untuk mengambil data peminjaman
  const fetchPeminjaman = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/peminjaman/user/${userId}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setPeminjaman(data);
        setFilteredPeminjaman(data);
      } else {
        console.error("Unexpected API response format", data);
        setPeminjaman([]);
        setFilteredPeminjaman([]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeminjaman();
  }, [userId]);

  const handleReturn = (peminjamanId) => {
    setSelectedPeminjamanId(peminjamanId);
    setIsModalOpen(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Validasi ukuran file (maksimal 2MB)
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file tidak boleh lebih dari 2MB.");
      event.target.value = ""; // Reset input file
      return;
    }

    setBuktiPengembalian(file);
  };

  const confirmReturn = async () => {
    if (!buktiPengembalian) {
      toast.error("Harap unggah file sebagai bukti pengembalian.");
      return;
    }

    const formData = new FormData();
    formData.append("bukti_pengembalian", buktiPengembalian);

    try {
      const response = await fetch(`http://localhost:5000/api/peminjaman/${selectedPeminjamanId}/kembali`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Barang gagal dikembalikan");
      }

      const updatedItem = await response.json();
      toast.success("Barang Berhasil Dikembalikan!");

      // Refresh data peminjaman setelah submit
      fetchPeminjaman();

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error dari server:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const filtered = peminjaman.filter((item) => {
      const matchesSearch = item.barang.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? item.status === statusFilter : true;

      // Filter tanggal peminjaman (sesuai tanggal yang dipilih)
      const matchesStartDate = startDateFilter ? new Date(item.startDate).toISOString().split("T")[0] === new Date(startDateFilter).toISOString().split("T")[0] : true;

      // Filter tanggal pengembalian (sesuai tanggal yang dipilih)
      const matchesEndDate = endDateFilter ? new Date(item.endDate).toISOString().split("T")[0] === new Date(endDateFilter).toISOString().split("T")[0] : true;

      return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });

    setFilteredPeminjaman(filtered);
  }, [searchTerm, statusFilter, startDateFilter, endDateFilter, peminjaman]);

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => prevPage + direction);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-100"; // Oren transparan
      case "REJECTED":
        return "bg-red-100"; // Merah transparan
      case "APPROVED":
        return "bg-green-100"; // Hijau transparan
      case "DIKEMBALIKAN":
        return "bg-blue-100"; // Biru transparan
      default:
        return "bg-white"; // Default putih
    }
  };

  const paginatedData = filteredPeminjaman.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredPeminjaman.length / itemsPerPage);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center">Daftar Peminjaman Anda</h1>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full p-2 border rounded-md">
              <option value="">Semua</option>
              <option value="APPROVED">Disetujui</option>
              <option value="DIKEMBALIKAN">Dikembalikan</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Ditolak</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cari Barang atau Tempat:</label>
            <input type="text" placeholder="Nama atau Kegiatan" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal Peminjaman:</label>
            <input type="date" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal Pengembalian:</label>
            <input type="date" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} className="w-full p-2 border rounded-md" />
          </div>
        </div>
      </div>

      {/* Card Grid */}
      {filteredPeminjaman.length === 0 ? (
        <div className="text-center py-4 text-gray-500">Tidak ada data peminjaman.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.map((item) => (
              <div key={item.id} className={`${getStatusColor(item.status)} rounded-lg shadow-md p-4`}>
                <h2 className="text-xl font-semibold mb-2 text-center">{item.barang.name}</h2>
                {item.barang.kategoriId === 1 ? (
                  <div className="text-gray-600 mb-2">
                    <span className="font-medium">Jumlah:</span> {item.jumlahBarang}
                  </div>
                ) : (
                  <div className="text-gray-600 mb-2"></div>
                )}

                <div className="text-gray-600 mb-2">
                  <span className="font-medium">Tanggal Peminjaman:</span> {new Date(item.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                <div className="text-gray-600 mb-2">
                  <span className="font-medium">Tanggal Pengembalian:</span> {new Date(item.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                <div className="text-gray-600 mb-2">
                  <span className="font-medium">Status:</span> {item.status}
                </div>
                {item.bukti_persetujuan && (
                  <div className="text-gray-600 mb-2">
                    <span className="font-medium">Bukti Persetujuan:</span>{" "}
                    <a href={`http://localhost:5000/uploads/${item.bukti_persetujuan}`} className="text-blue-500 underline" download>
                      <FontAwesomeIcon icon={faFile} />
                    </a>
                  </div>
                )}
                {item.catatan && item.catatan.trim() !== "" && (
                  <div className="text-gray-600 mb-2">
                    <span className="font-medium">Catatan:</span> {item.catatan}
                  </div>
                )}
                {item.status === "APPROVED" && (
                  <button onClick={() => handleReturn(item.id)} className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 transition duration-200">
                    Kembalikan
                  </button>
                )}
                {item.bukti_pengembalian && (
                  <div className="text-gray-600 mt-2">
                    <span className="font-medium">Bukti Pengembalian:</span>{" "}
                    <a href={`http://localhost:5000/uploads/${item.bukti_pengembalian}`} className="text-blue-500 underline" download>
                      <FontAwesomeIcon icon={faFile} />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-6">
            <button onClick={() => handlePageChange(-1)} disabled={currentPage === 1} className="bg-gray-500 text-white py-1 px-4 rounded disabled:opacity-50">
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => handlePageChange(1)} disabled={currentPage === totalPages} className="bg-gray-500 text-white py-1 px-4 rounded disabled:opacity-50">
              Next
            </button>
          </div>
        </>
      )}

      <ToastContainer autoClose={3000} />

      {/* Modal for file upload */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Pengembalian</h2>
            <p>Apakah Anda yakin ingin mengembalikan barang ini?</p>
            <input type="file" onChange={handleFileChange} className="mt-4" />
            <div className="mt-6 flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white py-1 px-4 rounded mr-2">
                Batal
              </button>
              <button onClick={confirmReturn} className="bg-blue-500 text-white py-1 px-4 rounded">
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeminjamanList;
