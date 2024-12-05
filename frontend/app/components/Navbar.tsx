"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDashboard, faTable, faTasks, faUsers, faClipboardList, faUserCircle, faHandHolding, faExclamationTriangle, faHistory, faBell, faTimes } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Navbar({ userId }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [user, setUser] = useState({ name: "", role: "", email: "", id: "" });
  const [pendingCount, setPendingCount] = useState(0);
  const [belumCount, setBelumCount] = useState(0);
  const [pendingPengaduanCount, setPendingPengaduanCount] = useState(0);
  const [catatanCount, setCatatanCount] = useState(0);
  const [catatanPengaduanCount, setCatatanPengaduanCount] = useState(0);
  const [notificationItems, setNotificationItems] = useState([]);
  const [notificationPengaduanItems, setNotificationPengaduanItems] = useState([]);

  const router = useRouter();
  const pathname = usePathname();

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  useEffect(() => {
    const fetchAllCounts = async (userId) => {
      try {
        // Fetch data peminjaman
        const pendingResponse = await fetch("http://localhost:5000/api/peminjaman/count/pending");
        const pendingData = await pendingResponse.json();
        setPendingCount(pendingData.pendingCount);

        const belumResponse = await fetch("http://localhost:5000/api/pengaduan/pelaksana/belum");
        const belumData = await belumResponse.json();
        setBelumCount(belumData.pelaksanaBelum);

        const catatanResponse = await fetch(`http://localhost:5000/api/peminjaman/user/${userId}/count`);
        const catatanData = await catatanResponse.json();
        setCatatanCount(catatanData.count);

        const notificationResponse = await fetch(`http://localhost:5000/api/peminjaman/user/${userId}/notif`);
        const notificationData = await notificationResponse.json();
        setNotificationItems(notificationData);

        // // Fetch data pengaduan
        // const pendingPengaduanResponse = await fetch("http://localhost:5000/api/pengaduan/count/pending");
        // const pendingPengaduanData = await pendingPengaduanResponse.json();
        // setPendingPengaduanCount(pendingPengaduanData.pendingCount);

        // const catatanPengaduanResponse = await fetch(`http://localhost:5000/api/pengaduan/user/${userId}/count`);
        // const catatanPengaduanData = await catatanPengaduanResponse.json();
        // setCatatanPengaduanCount(catatanPengaduanData.count);

        // const notificationPengaduanResponse = await fetch(`http://localhost:5000/api/pengaduan/user/${userId}/notif`);
        // const notificationPengaduanData = await notificationPengaduanResponse.json();
        // setNotificationPengaduanItems(notificationPengaduanData);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchAllCounts(storedUser.id);
    } else {
      router.push("/data-pegawai");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Fungsi untuk menangani pembaruan status notifikasi
  const handleUpdateNotification = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/peminjaman/user/${user.id}/notifikasi`, {
        method: "PUT", // Menggunakan PUT karena ingin memperbarui status
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Jika berhasil, memperbarui tampilan notifikasi
        setNotificationItems([]);
        setCatatanCount(0);
        // alert("Notifikasi berhasil diperbarui.");
      } else {
        alert("Gagal memperbarui notifikasi.");
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  // const handleUpdateNotificationPengaduan = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/pengaduan/user/${user.id}/notifikasi`, {
  //       method: "PUT", // Menggunakan PUT karena ingin memperbarui status
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (response.ok) {
  //       // Jika berhasil, memperbarui tampilan notifikasi
  //       setNotificationPengaduanItems([]);
  //       setCatatanPengaduanCount(0);
  //       // alert("Notifikasi berhasil diperbarui.");
  //     } else {
  //       alert("Gagal memperbarui notifikasi.");
  //     }
  //   } catch (error) {
  //     console.error("Error updating notification:", error);
  //   }
  // };
  // Tambahkan fungsi baru untuk memanggil kedua fungsi pembaruan notifikasi
  const handleMarkAllAsRead = async () => {
    // await handleUpdateNotificationPengaduan(); // Panggil fungsi pertama
    await handleUpdateNotification(); // Panggil fungsi kedua setelahnya
  };

  return (
    <div className="bg-gray-100 h-[100px]">
      <header className="flex justify-between items-center p-4 bg-gray-900">
        <div onClick={() => router.push("/")} className="text-white font-bold text-lg cursor-pointer hover:text-gray-300">
          SiPintar
        </div>

        <nav className="flex space-x-6">
          {user.role === "Admin" ? (
            <>
              <Link href="/data-barang" className={`${pathname === "/data-barang" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faTable} className="mr-2" />
                Data Barang
              </Link>
              <Link href="/data-peminjaman" className={`${pathname === "/data-peminjaman" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center relative`}>
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                Data Peminjaman
                {pendingCount > 0 && <span className="absolute top-0 right-0 mt-[-4px] mr-[-6px] bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingCount}</span>}
              </Link>
              {/* <Link href="/data-pengaduan" className={`${pathname === "/data-pengaduan" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center relative`}>
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                Data Pengaduan
                {pendingPengaduanCount > 0 && <span className="absolute top-0 right-0 mt-[-4px] mr-[-6px] bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingPengaduanCount}</span>}
              </Link>

              <Link href="/data-penugasan" className={`${pathname === "/data-penugasan" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center relative`}>
                <FontAwesomeIcon icon={faTasks} className="mr-2" />
                Data Penugasan
                {belumCount > 0 && <span className="absolute top-1 left-[90%] transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{belumCount}</span>}
              </Link> */}

              <Link href="/data-pegawai" className={`${pathname === "/data-pegawai" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Data Pengguna
              </Link>
            </>
          ) : (
            <>
              <Link href="/peminjaman" className={`${pathname === "/peminjaman" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faHandHolding} className="mr-2" />
                Peminjaman
              </Link>
              {/* <Link href="/pengaduan" className={`${pathname === "/pengaduan" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                Pengaduan
              </Link> */}
              <Link href="/riwayat-peminjaman" className={`${pathname === "/riwayat-peminjaman" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faHistory} className="mr-2" />
                Riwayat Peminjaman
              </Link>
              {/* <Link href="/riwayat-pengaduan" className={`${pathname === "/riwayat-pengaduan" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faHistory} className="mr-2" />
                Riwayat Pengaduan
              </Link> */}

              {/* Notification Bell */}
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faBell} className="text-gray-300 hover:text-white cursor-pointer" onClick={toggleNotification} />
                {catatanCount + catatanPengaduanCount > 0 && <span className="absolute top-0 right-0 mt-[-4px] mr-[-6px] bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{catatanCount + catatanPengaduanCount}</span>}

                {/* Modal kecil di bawah ikon lonceng */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-60 w-64 bg-white rounded-md shadow-lg p-4 z-10 max-h-80 overflow-y-auto">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold mb-2 text-gray-700 mx-auto">Daftar Notifikasi</h3>
                      <FontAwesomeIcon icon={faTimes} className="text-gray-500 cursor-pointer hover:text-gray-700" onClick={toggleNotification} />
                    </div>
                    <ul className="space-y-2">
                      {notificationItems.length > 0 ? (
                        notificationItems.slice(0, 5).map((item, index) => (
                          <li key={index} className="text-gray-700 border-b border-gray-200 pb-2">
                            <p className="font-semibold text-center">Peminjaman </p>
                            <p className="text-sm">Nama Barang : {item.barang.name}</p>
                            <p className="text-sm">Tanggal Pengajuan: {new Date(item.createdAt).toLocaleDateString("id-ID")}</p>
                            <p className="text-sm">Catatan: {item.catatan || "Tidak ada catatan"}</p>
                            <p className="text-sm">Status: {item.status || "Tidak ada status"}</p>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500"></li>
                      )}
                    </ul>
                    {/* <ul className="space-y-2">
                      {notificationPengaduanItems.length > 0 ? (
                        notificationPengaduanItems.slice(0, 5).map((item, index) => (
                          <li key={index} className="text-gray-700 border-b border-gray-200 pb-2">
                            <p className="font-semibold text-center">Pengaduan: </p>
                            <p className="text-sm">Kategori: {item.kategori || "Tidak ada catatan"}</p>
                            <p className="text-sm">Tanggal Pengaduan: {new Date(item.createdAt).toLocaleDateString("id-ID")}</p>
                            <p className="text-sm">Catatan: {item.catatan || "Tidak ada catatan"}</p>
                            <p className="text-sm">Status: {item.status || "Tidak ada status"}</p>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500"></li>
                      )}
                    </ul> */}
                    <button onClick={handleMarkAllAsRead} className="text-blue-500 text-sm mt-3 underline">
                      Tandai Semua sebagai Dibaca
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="relative">
            <button onClick={toggleUserMenu} className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-full">
              <FontAwesomeIcon icon={faUserCircle} />
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="px-4 py-2 text-gray-700">
                  <div className="font-bold py-1">{user.email || "Email"}</div>
                  <div className="text-sm font-bold text-gray-500">{user.role || "Role"}</div>
                </div>
                <div className="border-t border-gray-200"></div>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;
