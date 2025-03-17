"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      console.log("Login successful, user data:", data);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login berhasil!");
      setTimeout(() => {
        if (data.user.role === "Admin") {
          router.push("/data-peminjaman");
        } else {
          router.push("/peminjaman");
        }
      }, 1000); // Tunggu 1 detik sebelum redirect
    } else {
      console.error("Login failed:", res.statusText);
      toast.error("Login gagal, coba lagi.");
    }
  };

  const handleGoogleLogin = async () => {
    const result = await signIn("google", { redirect: false });

    if (result?.error) {
      console.error("Google login error:", result.error);
      toast.error("Login dengan Google gagal.");
    } else {
      // Tunggu session tersedia
      const session = await getSession();
      console.log("Session after Google login:", session);

      if (session?.user) {
        const { email, name, role } = session.user;
        localStorage.setItem("user", JSON.stringify({ email, name, role }));
        toast.success("Login berhasil!");

        // Redirect berdasarkan role
        setTimeout(() => {
          if (role === "Admin") {
            router.push("/data-peminjaman");
          } else {
            router.push("/peminjaman");
          }
        }, 1000); // Tunggu 1 detik sebelum redirect
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ToastContainer />
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
        {/* <button onClick={handleGoogleLogin} className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200 mt-4">
          Login dengan Google
        </button> */}
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
