"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddPegawaiModal({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [no_hp, setNo_hp] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const router = useRouter(); // Menginisialisasi router

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, no_hp }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Registrasi akun berhasil!", {
          position: "top-right",
        });

        // Alihkan ke halaman login setelah 3 detik
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const errorData = await res.json();
        if (errorData.error === "Email sudah digunakan") {
          toast.error("Email sudah digunakan, gunakan email lain.", {
            position: "top-right",
          });
        } else {
          toast.error("Registrasi gagal. Coba lagi.", {
            position: "top-right",
          });
        }
      }
    } catch (error) {
      toast.error("Terjadi kesalahan. Coba lagi.", { position: "top-right" });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Registrasi Akun</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nama</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">No Hp</label>
            <input type="number" value={no_hp} onChange={(e) => setNo_hp(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" required>
              <option value="" disabled>
                Pilih Role
              </option>
              <option value="Mahasiswa">Mahasiswa</option>
              <option value="Dosen">Dosen</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
              Batal
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPegawaiModal;
