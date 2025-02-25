"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import style untuk toastify

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const data = await res.json();

      // Simpan user data atau token ke localStorage/sessionStorage
      localStorage.setItem("user", JSON.stringify(data.user)); // Simpan data user
      // localStorage.setItem("token", data.token); // Jika ada token dari server

      toast.success("Login berhasil!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // Periksa role user dan arahkan ke halaman yang sesuai
      setTimeout(() => {
        if (data.user.role === "Admin") {
          router.push("/data-peminjaman"); // Arahkan ke halaman data barang
        } else {
          router.push("/peminjaman"); // Arahkan ke halaman peminjaman
        }
      }, 3000);
    } else {
      toast.error("Login gagal, coba lagi.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ToastContainer /> {/* Tambahkan ToastContainer di sini */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">
            Masuk
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun?{" "}
          <span onClick={() => router.push("/data-pegawai/add")} className="text-blue-500 hover:underline cursor-pointer">
            Registrasi
          </span>
        </p>
      </div>
    </div>
  );
}
