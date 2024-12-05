"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import CustomModal from "../../components/Modal";

const PengaduanList = () => {
  const [pengaduanList, setPengaduanList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [assignModalIsOpen, setAssignModalIsOpen] = useState(false); // State for Assign Modal
  const [currentAction, setCurrentAction] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // Store selected pegawai ID
  const [pegawaiList, setPegawaiList] = useState([]); // Store list of pegawai
  const itemsPerPage = 6;

  // Fetch all peminjaman data from the backend
  useEffect(() => {
    const fetchPengaduan = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pengaduan");
        const data = await response.json();
        setPengaduanList(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching pengaduan data:", error);
      }
    };

    fetchPengaduan();
  }, []);

  const fetchPegawai = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/pegawai");
      const data = await response.json();
      setPegawaiList(data);
    } catch (error) {
      console.error("Error fetching pegawai data:", error);
    }
  };

  const openModal = (action, id) => {
    setCurrentAction(action);
    setCurrentId(id);

    if (action === "assign") {
      fetchPegawai(); // Fetch pegawai data when opening assign modal
      setAssignModalIsOpen(true);
    } else {
      setModalIsOpen(true);
    }
  };
  const closeModal = () => {
    setModalIsOpen(false);
    setAssignModalIsOpen(false); // Close assign modal as well
    setCurrentAction(null);
    setCurrentId(null);
    setSelectedUserId(null); // Reset selected user
  };

  const handleAccept = async (catatan) => {
    closeModal(); // Close modal first
    try {
      const response = await fetch(`http://localhost:5000/api/pengaduan/${currentId}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ catatan }), // Mengirim catatan ke backend
      });

      if (response.ok) {
        toast.success("pengaduan Diterima!");
        setPengaduanList((prevList) => prevList.map((item) => (item.id === currentId ? { ...item, status: "APPROVED" } : item)));
      } else {
        toast.error("Failed to approve pengaduan.");
      }
    } catch (error) {
      console.error("Error approving pengaduan:", error);
      toast.error("Error approving pengaduan.");
    }
  };

  // Handle reject action with catatan
  const handleReject = async (catatan) => {
    closeModal(); // Close modal first
    try {
      const response = await fetch(`http://localhost:5000/api/pengaduan/${currentId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ catatan }), // Mengirim catatan ke backend
      });

      if (response.ok) {
        toast.success("Pengaduan Ditolak!");
        setPengaduanList((prevList) => prevList.map((item) => (item.id === currentId ? { ...item, status: "REJECTED" } : item)));
      } else {
        toast.error("Failed to reject pengaduan.");
      }
    } catch (error) {
      console.error("Error rejecting pengaduan:", error);
      toast.error("Error rejecting pengaduan.");
    }
  };

  // Handle assigning pelaksana
  const handleAssign = async () => {
    if (!selectedUserId || !currentId) {
      toast.error("Silakan pilih pelaksana dan pengaduan yang valid.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/pengaduan/assign_pelaksana", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: selectedUserId, pengaduanId: currentId }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Pelaksana berhasil ditugaskan!");

        // Update status di list pengaduan
        setPengaduanList((prevList) => prevList.map((item) => (item.id === currentId ? { ...item, status: "ON_PROGRESS" } : item)));

        // Tutup modal
        closeModal();

        // Tunggu 1 detik sebelum redirect ke halaman "data-penugasan"
        setTimeout(() => {
          window.location.href = "/data-penugasan"; // Ganti halaman ke "data-penugasan"
        }, 1000);
      } else {
        toast.error("Gagal menugaskan pelaksana.");
      }
    } catch (error) {
      console.error("Error assigning pelaksana:", error);
      toast.error("Error assigning pelaksana.");
    }
  };

  useEffect(() => {
    let filtered = pengaduanList;

    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter((item) => item.kategori === searchTerm);
    }

    if (startDateFilter) {
      filtered = filtered.filter((item) => new Date(item.createdAt).toISOString().split("T")[0] === startDateFilter);
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset ke halaman pertama setelah filter
  }, [statusFilter, searchTerm, startDateFilter, pengaduanList]);

  // Handle pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Daftar Pengaduan</h1>

      {/* Filters */}
      <div className="bg-gray-100 p-4 mb-4 rounded-md shadow-md flex flex-col md:flex-row justify-between gap-10">
        {/* Kontainer untuk dua filter pertama di sebelah kiri */}
        <div className="flex flex-col md:flex-row gap-10">
          <div>
            <label className="block mb-2 text-sm">Status:</label>
            <select className="p-2 border rounded-md" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Semua</option>
              <option value="APPROVED">Disetujui</option>
              <option value="ONPROGGRESS">ONPROGGRESS</option>
              <option value="REJECTED">REJECTED</option>
              <option value="PENDING">PENDING</option>
              <option value="DIKEMBALIKAN">COMPLETED</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm">Kategori:</label>
            <select className="p-2 border rounded-md" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}>
              <option value="">Semua</option>
              <option value="Pengadaan">Pengadaan</option>
              <option value="Kehilangan">Kehilangan</option>
              <option value="Kerusakan">Kerusakan</option>
            </select>
          </div>
        </div>

        {/* Kontainer untuk dua filter berikutnya di sebelah kanan */}
        <div className="flex flex-col md:flex-row gap-10">
          <div>
            <label className="block mb-2 text-sm">Tanggal Pengaduan:</label>
            <input type="date" className="p-2 border rounded-md" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        {currentItems.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((pengaduan) => (
              <div key={pengaduan.id} className="border rounded-lg p-4 shadow-md">
                <h2 className="text-lg font-semibold mb-2 text-center">{pengaduan.kategori}</h2>
                <p className="text-sm mb-1">
                  <strong>Nama Pengadu:</strong> {pengaduan.user.name}
                </p>
                <p className="text-sm mb-1">
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${pengaduan.user.email}`}
                    className="text-blue-500 underline"
                    onClick={(e) => e.stopPropagation()} // jika ada penanganan klik lain
                  >
                    {pengaduan.user.email}
                  </a>
                </p>
                <p className="text-sm mb-1">
                  <strong>Peran:</strong> {pengaduan.user.role}
                </p>

                <p className="text-sm mb-1">
                  <strong>Tanggal pengaduan:</strong>{" "}
                  {new Date(pengaduan.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <p className="text-sm mb-1">
                  <strong>Lokasi:</strong> {pengaduan.lokasi}
                </p>

                <p className="text-sm mb-1">
                  <strong>Deskripsi:</strong> {pengaduan.deskripsi}
                </p>

                <p className="text-sm mb-1">{pengaduan.status === "APPROVED" ? <strong>Status: Disetujui</strong> : <strong>Status: {pengaduan.status}</strong>}</p>
                <p className="text-sm mb-1">
                  <strong>Catatan:</strong> {pengaduan.catatan ? pengaduan.catatan : ""}
                </p>
                <p className="text-sm mb-1">
                  <strong>tanggapan:</strong> {pengaduan.tanggapan ? pengaduan.tanggapan : ""}
                </p>
                <p className="border border-gray-300 px-6 py-3">{pengaduan.photo ? <img src={`http://localhost:5000${pengaduan.photo}`} alt={pengaduan.name} className="mx-auto w-20 h-20 object-cover" /> : "No Image"}</p>

                <div className="flex justify-between items-center mt-4">
                  <div>
                    {/* Tombol Terima dan Tolak hanya muncul saat statusnya "PENDING" */}
                    {pengaduan.status === "PENDING" && (
                      <>
                        <button onClick={() => openModal("accept", pengaduan.id)} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">
                          Terima
                        </button>
                        <button onClick={() => openModal("reject", pengaduan.id)} className="bg-red-500 text-white px-4 py-2 rounded-md">
                          Tolak
                        </button>
                      </>
                    )}

                    {/* Tombol Assign ke Pelaksana hanya muncul saat statusnya "APPROVED" */}
                    {pengaduan.status === "APPROVED" && (
                      <button onClick={() => openModal("assign", pengaduan.id)} className="bg-blue-500 text-white px-4 py-2 ml-20 rounded-md">
                        Assign ke Pelaksana
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">Tidak ada Pengaduan yang ditemukan.</p>
        )}
      </div>
      <CustomModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        onConfirm={currentAction === "accept" ? handleAccept : handleReject}
        title="Konfirmasi Tindakan"
        message={`Apakah Anda yakin ingin ${currentAction === "accept" ? "menerima" : "menolak"} pengaduan ini?`}
        isAccept={currentAction === "accept"} // Pass action type
      />
      {assignModalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold">Assign ke Pelaksana</h2>
            <p className="mt-2">Pilih pelaksana untuk pengaduan ini:</p>
            <select className="mt-2 block w-full border border-gray-300 rounded-md p-2" onChange={(e) => setSelectedUserId(e.target.value)}>
              <option value="">Pilih Pelaksana</option>
              {pegawaiList.map((pegawai) => (
                <option key={pegawai.id} value={pegawai.id}>
                  {pegawai.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end mt-4">
              <button onClick={handleAssign} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
                Assign
              </button>
              <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded-md">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button className="px-4 py-2 bg-gray-200 rounded-md" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Prev
        </button>
        <span>
          Halaman {currentPage} dari {totalPages}
        </span>
        <button className="px-4 py-2 bg-gray-200 rounded-md" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default PengaduanList;
