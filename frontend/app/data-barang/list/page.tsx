"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import AddBarangModal from "../add/page";
import EditBarangModal from "../edit/page";
import DeleteConfirmationModal from "../delete/page";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BarangList() {
  const [barangList, setBarangList] = useState([]);
  const [filteredBarangList, setFilteredBarangList] = useState([]);
  const [categories, setCategories] = useState([]); // Store categories
  const [error, setError] = useState(null);
  const [editingBarang, setEditingBarang] = useState(null);
  const [deletingBarang, setDeletingBarang] = useState(null);
  const [addingBarang, setAddingBarang] = useState(false);
  const [searchName, setSearchName] = useState(""); // State for search input
  const [searchKondisi, setSearchKondisi] = useState(""); // State for search input
  const [searchLokasi, setSearchLokasi] = useState(""); // State for search input
  const [availabilityFilter, setAvailabilityFilter] = useState(""); // State for availability filter
  const [categoryFilter, setCategoryFilter] = useState(""); // State for category filter
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [previewImage, setPreviewImage] = useState(null); // State for image preview
  const itemsPerPage = 5; // Items per page

  // Fetch barang and categories data
  useEffect(() => {
    const fetchBarangList = async () => {
      try {
        const [barangRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:5000/api/barang"),
          fetch("http://localhost:5000/api/kategori"), // Fetch categories
        ]);

        if (!barangRes.ok || !categoriesRes.ok) {
          throw new Error("HTTP error!");
        }

        const barangData = await barangRes.json();
        const categoriesData = await categoriesRes.json();

        // Urutkan barang berdasarkan nama secara ascending
        const sortedBarangData = barangData.sort((a, b) => a.name.localeCompare(b.name));

        setBarangList(sortedBarangData);
        setFilteredBarangList(sortedBarangData);
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
      .filter((barang) => (availabilityFilter ? barang.available === availabilityFilter : true))
      .filter((barang) => (categoryFilter ? barang.kategoriId === parseInt(categoryFilter) : true));

    // Urutkan hasil filter berdasarkan nama secara ascending
    const sortedFilteredList = filteredList.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredBarangList(sortedFilteredList);
    setCurrentPage(1); // Reset to first page after filtering
  }, [searchName, searchKondisi, searchLokasi, availabilityFilter, categoryFilter, barangList]);

  // Handle pagination
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const paginatedBarangList = filteredBarangList.slice(firstIndex, lastIndex);

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.kategori : "Unknown"; // Fallback if category is not found
  };

  const handleAddBarang = () => setAddingBarang(true);
  const handleCloseAddModal = () => setAddingBarang(false);

  const handleSaveBarang = async (newBarang) => {
    try {
      const res = await fetch("http://localhost:5000/api/barang/add", {
        method: "POST",
        body: newBarang,
      });

      if (res.ok) {
        const data = await res.json();
        setBarangList((prevBarang) => [...prevBarang, data].sort((a, b) => a.name.localeCompare(b.name))); // Update state dan urutkan
        toast.success("Penambahan Barang berhasil!"); // Tampilkan notifikasi
        handleCloseAddModal(); // Tutup modal
      } else {
        const result = await res.json();
        toast.error(`Error: ${result.error}`); // Tampilkan error
      }
    } catch (error) {
      console.error("Error saving barang:", error.message);
      toast.error("Terjadi kesalahan. Gagal menyimpan barang.");
    }
  };

  const handleSaveEditBarang = async (id, updatedBarang) => {
    try {
      const res = await fetch(`http://localhost:5000/api/barang/${id}`, {
        method: "PATCH",
        body: updatedBarang,
      });

      if (res.ok) {
        const data = await res.json();
        const updatedList = barangList.map((barang) => (barang.id === id ? data : barang)).sort((a, b) => a.name.localeCompare(b.name)); // Update state dan urutkan
        setBarangList(updatedList);
        toast.success("Perubahan Barang berhasil!"); // Tampilkan notifikasi
        setEditingBarang(null); // Tutup modal
      } else {
        const result = await res.json();
        toast.error(`Error: ${result.error}`); // Tampilkan error
      }
    } catch (error) {
      console.error("Error editing barang:", error.message);
      toast.error("Terjadi kesalahan. Gagal mengedit barang.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBarang) return;

    try {
      const res = await fetch(`http://localhost:5000/api/barang/${deletingBarang.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const updatedList = barangList.filter((barang) => barang.id !== deletingBarang.id).sort((a, b) => a.name.localeCompare(b.name)); // Update state dan urutkan
        setBarangList(updatedList);
        toast.success("Penghapusan Barang berhasil!");
      } else {
        const result = await res.json();
        toast.error(`Error: ${result.error}`); // Tampilkan error dari backend
      }
    } catch (error) {
      console.error("Error deleting barang:", error.message);
      setError("Error deleting barang.");
    } finally {
      setDeletingBarang(null); // Close the delete modal
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleResetFilter = () => {
    setSearchName("");
    setSearchKondisi("");
    setSearchLokasi("");
    setAvailabilityFilter("");
    setCategoryFilter("");
    setFilteredBarangList(barangList); // Reset to full list
  };

  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  const totalPages = Math.ceil(filteredBarangList.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />

      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Daftar Barang & Tempat</h1>
        <div className="flex justify-end mb-4">
          <button className="bg-blue-500 -mt-12 text-white p-3 rounded-md shadow-lg hover:bg-blue-600 transition duration-200" onClick={handleAddBarang}>
            <FontAwesomeIcon icon={faPlus} size="lg" />
          </button>
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Search and Filters */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
              <input type="text" className="w-full p-2 border rounded-md" placeholder="Cari nama..." value={searchName} onChange={(e) => setSearchName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi</label>
              <input type="text" className="w-full p-2 border rounded-md" placeholder="Cari kondisi..." value={searchKondisi} onChange={(e) => setSearchKondisi(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input type="text" className="w-full p-2 border rounded-md" placeholder="Cari lokasi..." value={searchLokasi} onChange={(e) => setSearchLokasi(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ketersediaan</label>
              <select className="w-full p-2 border rounded-md" value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
                <option value="">Semua</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select className="w-full p-2 border rounded-md" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="">Semua</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.kategori}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200" onClick={handleResetFilter}>
              Reset Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kondisi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tersedia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedBarangList.map((barang) => (
                <tr key={barang.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{barang.name}</td>
                  <td className="px-6 py-4">
                    {barang.photo ? (
                      <img src={`http://localhost:5000${barang.photo}`} alt={barang.name} className="w-16 h-16 object-cover rounded cursor-pointer" onClick={() => handleImageClick(`http://localhost:5000${barang.photo}`)} />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="px-6 py-4">{barang.kondisi}</td>
                  <td className="px-6 py-4">{barang.lokasi}</td>
                  <td className="px-6 py-4">{getCategoryName(barang.kategoriId)}</td>
                  <td className="px-6 py-4">{barang.available}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition duration-200" onClick={() => setEditingBarang(barang)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200" onClick={() => setDeletingBarang(barang)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
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

      {/* Modals for adding, editing, and deleting */}
      {addingBarang && <AddBarangModal onSave={handleSaveBarang} onClose={handleCloseAddModal} />}
      {editingBarang && <EditBarangModal barang={editingBarang} onSave={handleSaveEditBarang} onClose={() => setEditingBarang(null)} />}
      {deletingBarang && <DeleteConfirmationModal show={!!deletingBarang} onClose={() => setDeletingBarang(null)} onConfirm={handleConfirmDelete} />}

      {/* Modal for image preview */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={handleClosePreview}>
          <div className="bg-white p-4 rounded-lg max-w-4xl max-h-full overflow-auto">
            <img src={previewImage} alt="Preview" className="max-w-full max-h-full" />
          </div>
        </div>
      )}
    </div>
  );
}
