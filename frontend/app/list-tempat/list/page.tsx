"use client";
import PeminjamanFormModal from "@/app/peminjaman/form/page";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation"; // Import useRouter untuk navigasi

export default function ListTempat() {
  const [barangList, setBarangList] = useState([]);
  const [filteredBarangList, setFilteredBarangList] = useState([]);
  const [categories, setCategories] = useState([]); // Store categories
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [searchName, setSearchName] = useState(""); // State for search input
  const [searchKondisi, setSearchKondisi] = useState(""); // State for search input
  const [searchLokasi, setSearchLokasi] = useState(""); // State for search input
  const [availabilityFilter, setAvailabilityFilter] = useState(""); // State for availability filter
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 6; // Items per page
  const router = useRouter(); // Inisialisasi useRouter

  // Fungsi untuk membuka modal dan menyimpan barang yang dipilih
  const handleOpenModal = (barang) => {
    if (barang.available === "Ya") {
      setSelectedBarang(barang);
      setModalOpen(true);
    } else {
      toast.error("Barang tidak tersedia untuk dipinjam.");
    }
  };

  // Fetch barang and categories data
  useEffect(() => {
    const fetchBarangList = async () => {
      try {
        const [barangRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:5000/api/barang/tempat"), // Fetch barang
          fetch("http://localhost:5000/api/kategori"), // Fetch categories
        ]);

        if (!barangRes.ok || !categoriesRes.ok) {
          throw new Error("HTTP error!");
        }

        const barangData = await barangRes.json();
        const categoriesData = await categoriesRes.json();

        setBarangList(barangData);
        setFilteredBarangList(barangData);
        setCategories(categoriesData); // Set categories data
      } catch (error) {
        console.error("Error fetching barang or categories:", error.message);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchBarangList();
  }, []);

  // Handle filtering
  useEffect(() => {
    const filteredList = barangList
      .filter((barang) => barang.name.toLowerCase().includes(searchName.toLowerCase()))
      .filter((barang) => barang.lokasi.toLowerCase().includes(searchLokasi.toLowerCase()))
      .filter((barang) => barang.kondisi.toLowerCase().includes(searchKondisi.toLowerCase()))
      .filter((barang) => (availabilityFilter ? barang.available === availabilityFilter : true));
    setFilteredBarangList(filteredList);
    setCurrentPage(1); // Reset to first page after filtering
  }, [searchName, searchKondisi, searchLokasi, availabilityFilter, barangList]);

  // Handle pagination
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const paginatedBarangList = filteredBarangList.slice(firstIndex, lastIndex);

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.kategori : "Unknown"; // Fallback if category is not found
  };

  // Fungsi untuk navigasi halaman berikutnya
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fungsi untuk navigasi halaman sebelumnya
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Fungsi untuk mereset filter
  const handleResetFilter = () => {
    setSearchName("");
    setSearchKondisi("");
    setSearchLokasi("");
    setAvailabilityFilter("");
    setFilteredBarangList(barangList); // Reset to full list
  };

  // Fungsi untuk menghandle submit form peminjaman
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

  const totalPages = Math.ceil(filteredBarangList.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />

      {/* Modal Form Peminjaman */}
      {isModalOpen && <PeminjamanFormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} selectedBarang={selectedBarang} />}

      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Daftar Tempat & Ruangan</h1>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-2 md:gap-4 w-full mb-6">
          <input type="text" className="p-2 border rounded-md flex-1 md:w-auto" placeholder="Cari berdasarkan nama" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
          <select className="p-2 border rounded-md flex-1 md:w-auto" value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
            <option value="">Ketersediaan</option>
            <option value="Ya">Ya</option>
            <option value="Tidak">Tidak</option>
          </select>
          <button className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200 flex-1 md:w-auto" onClick={handleResetFilter}>
            Reset Filter
          </button>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBarangList.map((barang) => (
            <div key={barang.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Gambar */}
              <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                {barang.photo ? <img src={`http://localhost:5000${barang.photo}`} alt={barang.name} className="w-full h-full object-contain" /> : <div className="text-gray-500">No Image</div>}
              </div>
              {/* Detail Barang */}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-center">{barang.name}</h2>
                <div className="text-gray-600 mb-2">
                  <span className="font-medium">Kondisi:</span> {barang.kondisi}
                </div>
                <div className="text-gray-600 mb-2">
                  <span className="font-medium">Lokasi:</span> {barang.lokasi}
                </div>
                <div className="text-gray-600 mb-2">
                  <span className="font-medium">Tersedia:</span> {barang.available}
                </div>
                {barang.available === "Ya" && (
                  <button onClick={() => handleOpenModal(barang)} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">
                    Ajukan Peminjaman
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-6">
          <button className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`} onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
