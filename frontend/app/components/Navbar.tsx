"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable, faUsers, faClipboardList, faUserCircle, faHandHolding, faHistory, faBell, faTimes, faList, faBuilding, faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Navbar({}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [user, setUser] = useState({ name: "", role: "", email: "", id: "" });
  const [pendingCount, setPendingCount] = useState(0);
  const [catatanCount, setCatatanCount] = useState(0);
  const [notificationItems, setNotificationItems] = useState([]);

  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  useEffect(() => {
    const fetchAllCounts = async (userId) => {
      try {
        const pendingResponse = await fetch("http://localhost:5000/api/peminjaman/count/pending");
        const pendingData = await pendingResponse.json();
        setPendingCount(pendingData.pendingCount);

        const catatanResponse = await fetch(`http://localhost:5000/api/peminjaman/user/${userId}/count`);
        const catatanData = await catatanResponse.json();
        setCatatanCount(catatanData.count);

        const notificationResponse = await fetch(`http://localhost:5000/api/peminjaman/user/${userId}/notif`);
        const notificationData = await notificationResponse.json();
        setNotificationItems(notificationData);
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

  const handleUpdateNotification = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/peminjaman/user/${user.id}/notifikasi`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setNotificationItems([]);
        setCatatanCount(0);
      } else {
        alert("Gagal memperbarui notifikasi.");
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    await handleUpdateNotification();
  };

  const handleLogoClick = () => {
    if (user.role === "Admin") {
      router.push("/data-peminjaman");
    } else {
      router.push("/peminjaman");
    }
  };

  return (
    <div className="bg-gray-100 h-[100px]">
      <header className="flex justify-between items-center p-4 bg-gray-900">
        {/* Logo and Hamburger Menu */}
        <div className="flex items-center">
          <div onClick={handleLogoClick} className="text-white font-bold text-lg cursor-pointer hover:text-gray-300">
            SiPintar
          </div>
          <button onClick={toggleMenu} className="text-white ml-4 md:hidden">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        {/* Nav Links (Desktop) */}
        <nav className="hidden md:flex space-x-6">
          {user.role === "Admin" ? (
            <>
              <Link href="/data-barang" className={`${pathname === "/data-barang" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faTable} className="mr-2" />
                Barang & Tempat
              </Link>
              <Link href="/data-peminjaman" className={`${pathname === "/data-peminjaman" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center relative`}>
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                Data Peminjaman
                {pendingCount > 0 && <span className="absolute top-0 right-0 mt-[-4px] mr-[-6px] bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingCount}</span>}
              </Link>
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
              <Link href="/list-barang" className={`${pathname === "/list-barang" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faList} className="mr-2" />
                Barang
              </Link>
              <Link href="/list-tempat" className={`${pathname === "/list-tempat" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                Tempat / Ruangan
              </Link>
              <Link href="/riwayat-peminjaman" className={`${pathname === "/riwayat-peminjaman" ? "bg-gray-700 text-white" : "text-gray-300"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FontAwesomeIcon icon={faHistory} className="mr-2" />
                Riwayat Peminjaman
              </Link>
            </>
          )}
        </nav>

        {/* Notification and User Menu */}
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center">
            {user.role !== "Admin" && (
              <button onClick={toggleNotification} className="text-gray-300 hover:text-white focus:outline-none relative">
                <FontAwesomeIcon icon={faBell} />
                {catatanCount > 0 && <span className="absolute top-0 right-0 mt-[-4px] mr-[-6px] bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{catatanCount}</span>}
              </button>
            )}

            {isNotificationOpen && (
              <div className="absolute right-0 mt-60 w-64 bg-white rounded-md shadow-lg p-4 z-50 max-h-80 overflow-y-auto">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold mb-2 text-gray-700 mx-auto">Daftar Notifikasi</h3>
                  <button onClick={toggleNotification} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <ul className="space-y-2">
                  {notificationItems.length > 0 ? (
                    notificationItems.slice(0, 5).map((item, index) => (
                      <li key={index} className="text-gray-700 border-b border-gray-200 pb-2">
                        <p className="font-semibold text-center">{item.barang.name} </p>
                        <p className="text-sm">kegiatan: {item.nama_kegiatan} </p>
                        <p className="text-sm">Tanggal Pengajuan: {new Date(item.createdAt).toLocaleDateString("id-ID")}</p>
                        <p className="text-sm">Catatan: {item.catatan || "Tidak ada catatan"}</p>
                        <p className="text-sm mb-1">{item.status === "APPROVED" ? <strong>Status: Disetujui</strong> : item.status === "REJECTED" ? <strong>Status: Ditolak</strong> : <strong>Status: {item.status}</strong>}</p>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">Tidak ada notifikasi</li>
                  )}
                </ul>
                <button onClick={handleMarkAllAsRead} className="text-blue-500 text-sm mt-3 underline">
                  Tandai Semua sebagai Dibaca
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={toggleUserMenu} className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-full focus:outline-none">
              <FontAwesomeIcon icon={faUserCircle} />
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <div className="px-4 py-2 text-gray-700">
                  <div className="font-bold py-1">{user.email || "Email"}</div>
                  <div className="text-sm font-bold text-gray-500">{user.role || "Role"}</div>
                </div>
                <div className="border-t border-gray-200"></div>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 focus:outline-none">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50">
          <div className="bg-gray-900 w-3/4 h-full p-4">
            <button onClick={toggleMenu} className="text-white mb-4 focus:outline-none">
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <nav className="flex flex-col space-y-4">
              {user.role === "Admin" ? (
                <>
                  <Link href="/data-barang" className={`${pathname === "/data-barang" ? "bg-gray-700 text-white" : "text-white"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                    <FontAwesomeIcon icon={faTable} className="mr-2" />
                    Data Barang
                  </Link>
                  <Link href="/data-peminjaman" className={`${pathname === "/data-peminjaman" ? "bg-gray-700 text-white" : "text-white"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center relative`}>
                    <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                    Data Peminjaman
                    {pendingCount > 0 && <span className="absolute top-0 right-0 mt-[-4px] mr-[-6px] bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingCount}</span>}
                  </Link>
                  <Link href="/data-pegawai" className={`${pathname === "/data-pegawai" ? "bg-gray-700 text-white" : "text-white"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                    <FontAwesomeIcon icon={faUsers} className="mr-2" />
                    Data Pengguna
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/peminjaman" className={`${pathname === "/peminjaman" ? "bg-gray-700 text-white" : "text-white"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                    <FontAwesomeIcon icon={faHandHolding} className="mr-2" />
                    Peminjaman
                  </Link>
                  <Link href="/list-barang" className={`${pathname === "/list-barang" ? "bg-gray-700 text-white" : "text-white"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                    <FontAwesomeIcon icon={faList} className="mr-2" />
                    Barang
                  </Link>
                  <Link href="/list-tempat" className={`${pathname === "/list-tempat" ? "bg-gray-700 text-white" : "text-white"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                    <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                    Tempat / Ruangan
                  </Link>
                  <Link href="/riwayat-peminjaman" className={`${pathname === "/riwayat-peminjaman" ? "bg-gray-700 text-white" : "text-white"} hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                    <FontAwesomeIcon icon={faHistory} className="mr-2" />
                    Riwayat Peminjaman
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
