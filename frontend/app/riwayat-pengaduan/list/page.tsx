"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faCheck } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PengaduanList = ({ userId }) => {
  const [pengaduan, setPengaduan] = useState([]);
  const [filteredPengaduan, setFilteredPengaduan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPengaduanId, setSelectedPengaduanId] = useState(null);
  const [tanggapan, setTanggapan] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPengaduan = async () => {
      if (!userId) {
        setError("Invalid user ID");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/pengaduan/user/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch pengaduan data");
        }
        const data = await response.json();
        setPengaduan(data);
        setFilteredPengaduan(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPengaduan();
  }, [userId]);

  const handleTanggapan = (pengaduanId) => {
    setSelectedPengaduanId(pengaduanId);
    setIsModalOpen(true);
  };

  const confirmTanggapan = async () => {
    if (!tanggapan.trim()) {
      toast.error("Tanggapan tidak boleh kosong.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/pengaduan/${selectedPengaduanId}/feedback`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tanggapan }),
      });

      if (!response.ok) {
        throw new Error("Gagal memberikan tanggapan");
      }

      toast.success("Tanggapan berhasil diberikan!");

      setPengaduan((prevPengaduan) => prevPengaduan.map((item) => (item.id === selectedPengaduanId ? { ...item, tanggapan } : item)));

      setIsModalOpen(false);
      setTanggapan("");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const filtered = pengaduan.filter((item) => {
      const matchesKategori = kategoriFilter ? item.kategori === kategoriFilter : true;
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      const matchesStartDate = startDateFilter ? new Date(item.createdAt).toISOString().split("T")[0] === startDateFilter : true;
      const matchesEndDate = endDateFilter ? new Date(item.createdAt) <= new Date(endDateFilter) : true;

      return matchesKategori && matchesStatus && matchesStartDate && matchesEndDate;
    });

    setFilteredPengaduan(filtered);
    setCurrentPage(1);
  }, [kategoriFilter, statusFilter, startDateFilter, endDateFilter, pengaduan]);

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => prevPage + direction);
  };

  const hasApprovedStatus = filteredPengaduan.some((item) => item.status === "ONPROGGRESS");

  const paginatedData = filteredPengaduan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredPengaduan.length / itemsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pengaduan-list p-6 bg-gray-100 mx-10 mt-5">
      <h1 className="text-2xl font-bold mb-4 text-center">Daftar Pengaduan Anda</h1>

      {/* Search and Filters */}
      <div className="filters mb-4 p-4 bg-gray-100 rounded-md flex gap-6 items-center">
        {/* Filter by Status */}
        <div className="flex flex-col w-1/6">
          <label className="text-sm text-gray-600 mb-1">Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border p-2 rounded">
            <option value="">Semua</option>
            <option value="APPROVED">Disetujui</option>
            <option value="ONPROGGRESS">OnProgress</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Filter by Kategori */}
        <div className="flex flex-col w-1/4">
          <label className="text-sm text-gray-600 mb-1">Kategori Pengaduan:</label>
          <select value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)} className="border p-2 rounded">
            <option value="">Semua</option>
            <option value="Pengadaan">Pengadaan</option>
            <option value="Kerusakan">Kerusakan</option>
            <option value="Kehilangan">Kehilangan</option>
          </select>
        </div>

        {/* Filter by Start Date */}
        <div className="flex flex-col w-1/4 translate-x-[400px]">
          <label className="text-sm text-gray-600 mb-1">Tanggal Pengaduan</label>
          <input type="date" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} className="border p-2 rounded" />
        </div>
      </div>

      {/* Table of Pengaduan */}
      {filteredPengaduan.length === 0 ? (
        <p>Belum ada pengaduan yang sesuai dengan kriteria pencarian/filter.</p>
      ) : (
        <>
          <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-3 px-4 text-left">No</th>
                <th className="py-3 px-4 text-left">Kategori</th>
                <th className="py-3 px-4 text-left">Deskripsi</th>
                <th className="py-3 px-4 text-left">Tanggal Pengaduan</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Catatan</th>
                <th className="py-3 px-4 text-left">Gambar</th>
                {hasApprovedStatus && <th className="py-3 px-4 text-left">Action</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="py-2 px-4">{item.kategori}</td>
                  <td className="py-2 px-4">{item.deskripsi}</td>
                  <td className="py-2 px-4">{new Date(item.createdAt).toLocaleDateString("id-ID")}</td>
                  <td className="py-2 px-4">{item.status === "APPROVED" ? "Disetujui" : item.status}</td>
                  <td className="py-2 px-4">{item.catatan || ""}</td>
                  <td className="border border-gray-300 px-6 py-3">{item.photo ? <img src={`http://localhost:5000${item.photo}`} alt={item.name} className="mx-auto w-20 h-20 object-cover" /> : "No Image"}</td>

                  {hasApprovedStatus && (
                    <td className="py-2 px-1 pl-10">
                      {item.status === "ONPROGGRESS" && (
                        <button className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 transition duration-200" onClick={() => handleTanggapan(item.id)}>
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-4">
            <button onClick={() => handlePageChange(-1)} disabled={currentPage === 1} className="bg-gray-500 text-white py-1 px-4 rounded disabled:opacity-50">
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => handlePageChange(1)} disabled={currentPage === totalPages} className="bg-gray-500 text-white py-1 px-4 rounded disabled:opacity-50">
              Next
            </button>
          </div>
        </>
      )}

      <ToastContainer autoClose={3000} />

      {/* Modal for Tanggapan */}
      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="modal-content bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Beri Tanggapan</h2>
            <textarea value={tanggapan} onChange={(e) => setTanggapan(e.target.value)} placeholder="Tulis tanggapan Anda di sini..." className="border p-2 w-full rounded mb-4" rows="4" />
            <div className="mt-6 flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white py-1 px-4 rounded mr-2">
                Batal
              </button>
              <button onClick={confirmTanggapan} className="bg-blue-500 text-white py-1 px-4 rounded">
                Kirim Tanggapan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PengaduanList;
