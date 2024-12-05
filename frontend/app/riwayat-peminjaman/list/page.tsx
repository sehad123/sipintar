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
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  useEffect(() => {
    const fetchPeminjaman = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/peminjaman/user/${userId}`);
        const data = await response.json();

        // Pastikan data adalah array
        if (Array.isArray(data)) {
          setPeminjaman(data);
          setFilteredPeminjaman(data); // Initialize filtered data
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

    fetchPeminjaman();
  }, [userId]);

  const handleReturn = (peminjamanId) => {
    setSelectedPeminjamanId(peminjamanId);
    setIsModalOpen(true);
  };

  const handleFileChange = (event) => {
    setBuktiPengembalian(event.target.files[0]);
  };

  const confirmReturn = async () => {
    if (!buktiPengembalian) {
      toast.error("Please upload file sebagai bukti pengembalian.");
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
        const errorData = await response.json(); // Dapatkan pesan error dari server
        throw new Error(errorData.error || "Barang gagal dikembalikan");
      }

      const updatedItem = await response.json();
      toast.success("Barang Berhasil Dikembalikan!");

      setPeminjaman((prevPeminjaman) => prevPeminjaman.map((item) => (item.id === selectedPeminjamanId ? { ...item, status: "DIKEMBALIKAN" } : item)));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error dari server:", error); // Log error dari server
      toast.error(error.message);
    }
  };

  // Filtering logic based on search, status, and dates
  useEffect(() => {
    const filtered = peminjaman.filter((item) => {
      const matchesSearch = item.barang.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      const matchesStartDate = startDateFilter ? new Date(item.startDate) >= new Date(startDateFilter) : true;
      const matchesEndDate = endDateFilter ? new Date(item.endDate) <= new Date(endDateFilter) : true;

      return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });

    console.log("Filtered data:", filtered);
    setFilteredPeminjaman(filtered);
  }, [searchTerm, statusFilter, startDateFilter, endDateFilter, peminjaman]);

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => prevPage + direction);
  };

  const hasApprovedStatus = filteredPeminjaman.some((item) => item.status === "APPROVED");

  const paginatedData = filteredPeminjaman.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredPeminjaman.length / itemsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="peminjaman-list p-6 bg-gray-100 mx-10 mt-5">
      <h1 className="text-2xl font-bold mb-4 text-center">Daftar Peminjaman Anda</h1>

      {/* Search and Filters */}
      <div className="filters mb-4 p-4 bg-gray-100 rounded-md flex gap-6 items-center">
        <div className="flex flex-col w-1/6">
          <label className="text-sm text-gray-600 mb-1">Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border p-2 rounded">
            <option value="">Semua</option>
            <option value="APPROVED">Approved</option>
            <option value="DIKEMBALIKAN">Dikembalikan</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="flex flex-col w-1/4">
          <label className="text-sm text-gray-600 mb-1">Cari Barang atau Tempat:</label>
          <input type="text" placeholder="Nama atau Kegiatan" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border p-2 rounded" />
        </div>

        <div className="flex flex-col w-1/6 ml-64">
          <label className="text-sm text-gray-600 mb-1">Tanggal Peminjaman:</label>
          <input type="date" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} className="border p-2 rounded" />
        </div>

        <div className="flex flex-col w-1/6">
          <label className="text-sm text-gray-600 mb-1">Tanggal Pengembalian:</label>
          <input type="date" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} className="border p-2 rounded" />
        </div>
      </div>

      {/* Table of Peminjaman */}
      {filteredPeminjaman.length === 0 ? (
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-4 text-left">No</th>
              <th className="py-3 px-4 text-left">Nama Barang</th>
              <th className="py-3 px-4 text-left">Tanggal Peminjaman</th>
              <th className="py-3 px-4 text-left">Tanggal Pengembalian</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Catatan</th>
              <th className="py-3 px-4 text-left">Bukti Persetujuan</th>
              <th className="py-3 px-4 text-left">Bukti Pengembalian</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                Tidak ada data peminjaman.
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <>
          <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-3 px-4 text-left">No</th>
                <th className="py-3 px-4 text-left">Nama Barang</th>
                <th className="py-3 px-4 text-left">Tanggal Peminjaman</th>
                <th className="py-3 px-4 text-left">Tanggal Pengembalian</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Catatan</th>
                <th className="py-3 px-4 text-left">Bukti Persetujuan</th>
                {hasApprovedStatus && <th className="py-3 px-4 text-left">Action</th>}
                <th className="py-3 px-4 text-left">Bukti Pengembalian</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="py-2 px-4">{item.barang.name}</td>
                  <td className="py-2 px-4">{new Date(item.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</td>
                  <td className="py-2 px-4">{new Date(item.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</td>
                  <td className="py-2 px-4">{item.status}</td>
                  <td className="py-2 px-4">{item.catatan || ""}</td>
                  <td className="py-2 px-4 pl-16">
                    {item.bukti_persetujuan ? (
                      <a href={`http://localhost:5000/uploads/${item.bukti_persetujuan}`} className="text-blue-500 underline" download>
                        <FontAwesomeIcon icon={faFile} />
                      </a>
                    ) : (
                      "No file"
                    )}
                  </td>
                  {hasApprovedStatus && (
                    <td className="py-2 px-1 pl-10">
                      {item.status === "APPROVED" && (
                        <button className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 transition duration-200" onClick={() => handleReturn(item.id)}>
                          Kembalikan
                        </button>
                      )}
                    </td>
                  )}
                  <td className="py-2 px-4  pl-16">
                    {item.bukti_pengembalian ? (
                      <a href={`http://localhost:5000/uploads/${item.bukti_pengembalian}`} className="text-blue-500 underline" download>
                        <FontAwesomeIcon icon={faFile} />
                      </a>
                    ) : (
                      "No file"
                    )}
                  </td>
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

      {/* Modal for file upload */}
      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="modal-content bg-white p-6 rounded shadow-lg">
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
