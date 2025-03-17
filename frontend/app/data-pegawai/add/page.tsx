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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  // State untuk menyimpan pesan error
  const [emailError, setEmailError] = useState("");
  const [noHpError, setNoHpError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

  // Fungsi validasi email
  // Fungsi validasi email
  const validateEmail = (email) => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@stis\.ac\.id$/;
    return emailPattern.test(email);
  };

  // Fungsi validasi email mahasiswa
  const validateMahasiswaEmail = (email) => {
    const mahasiswaEmailPattern = /^\d+@stis\.ac\.id$/;
    return mahasiswaEmailPattern.test(email);
  };

  // Fungsi validasi email dosen dan alumni
  const validateDosenAlumniEmail = (email) => {
    const dosenAlumniEmailPattern = /^[A-Za-z]+@stis\.ac\.id$/;
    return dosenAlumniEmailPattern.test(email);
  };

  // Fungsi validasi nomor HP
  const validateNoHp = (no_hp) => {
    return no_hp.length >= 10;
  };

  // Fungsi validasi password
  const validatePassword = (password, confirmPassword) => {
    return password === confirmPassword;
  };

  // Handle perubahan input email
  // Handle perubahan input email
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!validateEmail(value)) {
      setEmailError("Email harus menggunakan domain @stis.ac.id");
    } else if (role === "Mahasiswa" && !validateMahasiswaEmail(value)) {
      setEmailError("Email mahasiswa harus berupa angka (contoh: 222112358@stis.ac.id)");
    } else if ((role === "Dosen" || role === "Alumni") && !validateDosenAlumniEmail(value)) {
      setEmailError("Email dosen/alumni tidak boleh berupa angka (contoh: john.doe@stis.ac.id)");
    } else {
      setEmailError("");
    }
  };

  // Handle perubahan input nomor HP
  const handleNoHpChange = (e) => {
    const value = e.target.value;
    setNo_hp(value);

    if (!validateNoHp(value)) {
      setNoHpError("Nomor HP minimal harus 10 digit");
    } else {
      setNoHpError("");
    }
  };

  // Handle perubahan input konfirmasi password
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (!validatePassword(password, value)) {
      setPasswordError("Password dan konfirmasi password tidak cocok");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sebelum submit
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("Email harus menggunakan domain @stis.ac.id");
      isValid = false;
    } else if (role === "Mahasiswa" && !validateMahasiswaEmail(email)) {
      setEmailError("Email mahasiswa harus berupa angka (contoh: 222112358@stis.ac.id)");
      isValid = false;
    } else if ((role === "Dosen" || role === "Alumni") && !validateDosenAlumniEmail(email)) {
      setEmailError("Email dosen/alumni tidak boleh berupa angka (contoh: john.doe@stis.ac.id)");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!validateNoHp(no_hp)) {
      setNoHpError("Nomor HP minimal harus 10 digit");
      isValid = false;
    } else {
      setNoHpError("");
    }

    if (!validatePassword(password, confirmPassword)) {
      setPasswordError("Password dan konfirmasi password tidak cocok");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) {
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, no_hp }),
      });

      if (res.ok) {
        toast.success("Registrasi akun berhasil!", {
          position: "top-right",
        });

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

  const handleCancel = () => {
    router.push("/login");
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
            <input type="email" value={email} onChange={handleEmailChange} className="w-full p-2 border border-gray-300 rounded-md" required />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">No Hp</label>
            <input type="number" value={no_hp} onChange={handleNoHpChange} className="w-full p-2 border border-gray-300 rounded-md" required />
            {noHpError && <p className="text-red-500 text-sm mt-1">{noHpError}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Konfirmasi Password</label>
            <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} className="w-full p-2 border border-gray-300 rounded-md" required />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
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
            <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md">
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
