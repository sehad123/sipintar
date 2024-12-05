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
  const [error, setError] = useState(null); // State for handling errors
  const [addingPegawai, setAddingPegawai] = useState(false); // State for showing Add Modal
  const [editingUser, setEditingUser] = useState(null); // State for the user being edited
  const [deletingUser, setDeletingUser] = useState(null); // State for the user being deleted
  const router = useRouter();

  // const handleDetailTugas = (userId) => {
  //   router.push(`/detail-tugas/${userId}`);
  // };

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
      } catch (error) {
        console.error("Error fetching Pegawai users:", error.message);
        setError("Failed to fetch Pegawai users. Please try again later.");
      }
    };

    fetchPegawaiUsers();
  }, []);

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
            {pegawaiUsers.length > 0 ? (
              pegawaiUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td> {/* Nomer Urut */}
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
                <td colSpan="4" className="text-center text-gray-600 py-4">
                  Tidak ada Pegawai yang terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
