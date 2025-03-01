"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import EditPegawaiModal from "../edit/page"; // Import edit modal
import DeleteConfirmationModal from "../delete/page"; // Import delete modal
import AddPegawaiModal from "../add/page"; // Import the new Add Modal

export default function PegawaiList() {
  const [pegawaiUsers, setPegawaiUsers] = useState([]); // State for Pegawai users
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
  const [error, setError] = useState(null); // State for handling errors
  const [addingPegawai, setAddingPegawai] = useState(false); // State for showing Add Modal
  const [editingUser, setEditingUser] = useState(null); // State for the user being edited
  const [deletingUser, setDeletingUser] = useState(null); // State for the user being deleted
  const [namaFilter, setNamaFilter] = useState(""); // State for nama filter
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage] = useState(10); // Items per page
  const router = useRouter();

  // Fetch Pegawai users when the component loads
  useEffect(() => {
    const fetchPegawaiUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/pegawai");
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setPegawaiUsers(data);
        setFilteredUsers(data); // Initialize filteredUsers with all users
      } catch (error) {
        console.error("Error fetching Pegawai users:", error.message);
        setError("Failed to fetch Pegawai users. Please try again later.");
      }
    };

    fetchPegawaiUsers();
  }, []);

  // Apply filters whenever namaFilter or statusFilter changes
  useEffect(() => {
    let filtered = pegawaiUsers;

    if (namaFilter) {
      filtered = filtered.filter((user) => user.name.toLowerCase().includes(namaFilter.toLowerCase()));
    }

    if (statusFilter) {
      filtered = filtered.filter((user) => user.role === statusFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to the first page whenever filters change
  }, [namaFilter, statusFilter, pegawaiUsers]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle adding new Pegawai
  const handleAddPegawai = () => {
    setAddingPegawai(true); // Open the Add Modal
  };

  const handleCloseAddModal = () => {
    setAddingPegawai(false); // Close the Add Modal
  };

  const handleSavePegawai = async (newUser) => {
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) {
        throw new Error(`Failed to add Pegawai. Status: ${res.status}`);
      }
      const data = await res.json();

      // Add the new user to the state
      setPegawaiUsers([...pegawaiUsers, data]);
      handleCloseAddModal(); // Close the modal after saving
    } catch (error) {
      console.error("Error adding Pegawai user:", error.message);
      setError("Error adding Pegawai user.");
    }
  };

  // Handle opening edit modal for a Pegawai user
  const handleEditPegawai = (user) => {
    setEditingUser(user); // Set the user being edited
  };

  // Handle closing the modal
  const handleCloseEditModal = () => {
    setEditingUser(null); // Close the modal by setting the state to null
  };

  // Handle save changes after editing
  const handleSaveUser = async (id, updatedUser) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      if (!res.ok) {
        throw new Error(`Failed to update user. Status: ${res.status}`);
      }
      const data = await res.json();

      // Update the state with the updated user
      setPegawaiUsers((prevUsers) => prevUsers.map((user) => (user.id === id ? data : user)));
      handleCloseEditModal(); // Close the modal
    } catch (error) {
      console.error("Error updating Pegawai user:", error.message);
      setError("Error updating Pegawai user.");
    }
  };

  // Handle opening delete confirmation modal
  const handleDeletePegawai = (user) => {
    setDeletingUser(user); // Set the user to be deleted
  };

  // Handle closing delete modal
  const handleCloseDeleteModal = () => {
    setDeletingUser(null); // Close the modal
  };

  // Handle confirming delete Pegawai
  const handleConfirmDelete = async () => {
    if (deletingUser) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${deletingUser.id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error(`Failed to delete Pegawai. Status: ${res.status}`);
        }
        setPegawaiUsers(pegawaiUsers.filter((user) => user.id !== deletingUser.id)); // Remove the user from the state
        handleCloseDeleteModal(); // Close the modal after deleting
      } catch (error) {
        console.error("Error deleting Pegawai:", error.message);
        setError("Error deleting Pegawai.");
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center">
      {/* Add Plus Icon */}
      {/* <button className="absolute top-1 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-200" onClick={handleAddPegawai}>
        <FontAwesomeIcon icon={faPlus} size="lg" />
      </button> */}

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Daftar Akun Pengguna</h1>

        {/* Error message */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Filter Section */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">Filter Nama:</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Cari berdasarkan nama..." value={namaFilter} onChange={(e) => setNamaFilter(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">Filter Status:</label>
            <select className="w-full p-2 border border-gray-300 rounded-md" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Semua</option>
              <option value="Mahasiswa">Mahasiswa</option>
              <option value="Alumni">Alumni</option>
              <option value="Dosen">Dosen</option>
            </select>
          </div>
        </div>

        {/* List of Pegawai users */}
        <table className="w-full table-auto bg-gray-100 border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Nama</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">No Hp</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              {/* <th className="border border-gray-300 px-4 py-2 text-center">Action</th> */}
              {/* <th className="border border-gray-300 px-4 py-2 text-center">Detail Tugas</th> Kolom detail */}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-300 px-4 py-2">{indexOfFirstItem + index + 1}</td> {/* Nomer Urut */}
                  <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.no_hp}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                  {/* <td className="border border-gray-300 px-4 py-2 flex justify-around text-center">
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditPegawai(user)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDeletePegawai(user)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td> */}
                  {/* <td className="border border-gray-300 px-4 py-2 text-center">
                    <button className="text-green-500 hover:text-green-700" onClick={() => handleDetailTugas(user.id)}>
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-600 py-4">
                  Tidak ada Pegawai yang terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button className="px-4 py-2 bg-gray-200 rounded-md" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </button>
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
          <button className="px-4 py-2 bg-gray-200 rounded-md" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </button>
        </div>
      </div>

      {/* Add Pegawai Modal */}
      {addingPegawai && <AddPegawaiModal onSave={handleSavePegawai} onClose={handleCloseAddModal} />}

      {/* Edit Pegawai Modal */}
      {editingUser && <EditPegawaiModal user={editingUser} onClose={handleCloseEditModal} onSave={handleSaveUser} />}

      {/* Delete Confirmation Modal */}
      {deletingUser && <DeleteConfirmationModal user={deletingUser} onClose={handleCloseDeleteModal} onDelete={handleConfirmDelete} />}
    </div>
  );
}
