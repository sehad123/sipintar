"use client";
import React, { useEffect, useState } from "react";

const PelaksanaTable = () => {
  const [pelaksanaList, setPelaksanaList] = useState([]);
  const [filteredPelaksanaList, setFilteredPelaksanaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchPelaksanaData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pengaduan/pelaksana");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setPelaksanaList(data);
        setFilteredPelaksanaList(data); // Initial full data
      } catch (error) {
        console.error("Error fetching pelaksana data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPelaksanaData();
  }, []);

  // Update filtered data whenever filters change
  useEffect(() => {
    let filteredData = pelaksanaList;

    // Filter by name
    if (searchName) {
      filteredData = filteredData.filter((item) => item.user.name.toLowerCase().includes(searchName.toLowerCase()));
    }

    // Filter by assignment date
    if (filterDate) {
      filteredData = filteredData.filter((item) => item.tgl_penugasan && item.tgl_penugasan.startsWith(filterDate));
    }

    // Filter by completion status
    if (filterStatus) {
      filteredData = filteredData.filter((item) => item.is_selesai === filterStatus);
    }

    setFilteredPelaksanaList(filteredData);
    setCurrentPage(1); // Reset to the first page on new filter
  }, [searchName, filterDate, filterStatus, pelaksanaList]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPelaksanaList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPelaksanaList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Daftar Pelaksana Pengaduan</h2>

      {/* Filter Section */}
      <div className="flex flex-wrap mb-4 gap-4 justify-center">
        <input type="text" placeholder="Cari Nama Pelaksana" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="border p-2 rounded" />
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="border p-2 rounded" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border p-2 rounded">
          <option value="">Status Penyelesaian</option>
          <option value="Sudah">Sudah</option>
          <option value="Belum">Belum</option>
        </select>
      </div>

      {/* Table Section */}
      {currentItems.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Nama Pelaksana</th>
              <th className="border px-4 py-2">No. HP</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Kategori Pengaduan</th>
              <th className="border px-4 py-2">Deskripsi Pengaduan</th>
              <th className="border px-4 py-2">Tanggal Assign</th>
              <th className="border px-4 py-2">Status Penyelesaian</th>
              <th className="border px-4 py-2">Tanggal Selesai</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((pelaksana, index) => (
              <tr key={pelaksana.id} className="text-center">
                <td className="border px-4 py-2">{indexOfFirstItem + index + 1}</td>
                <td className="border px-4 py-2">{pelaksana.user.name}</td>
                <td className="border px-4 py-2">{pelaksana.user.no_hp}</td>
                <td className="border px-4 py-2">{pelaksana.user.email}</td>
                <td className="border px-4 py-2">{pelaksana.pengaduan.kategori}</td>
                <td className="border px-4 py-2">{pelaksana.pengaduan.deskripsi}</td>
                <td className="border px-4 py-2">{pelaksana.tgl_penugasan ? formatDate(pelaksana.tgl_penugasan) : "Belum selesai"}</td>
                <td className="border px-4 py-2">{pelaksana.is_selesai}</td>
                <td className="border px-4 py-2">{pelaksana.tgl_selesai ? formatDate(pelaksana.tgl_selesai) : "Belum selesai"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">Tidak ada data pelaksana yang ditemukan.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => handlePageChange(i + 1)} className={`px-4 py-2 border ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"}`}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PelaksanaTable;
