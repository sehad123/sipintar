"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHolding, faList, faBuilding, faHistory, faTable, faClipboardList, faUsers } from "@fortawesome/free-solid-svg-icons";

export function Footer() {
  const [user, setUser] = useState({ role: "" });

  useEffect(() => {
    // Ambil data user dari localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          {/* About Us Section */}
          <div className="w-1/4">
            <h2 className="text-lg font-semibold mb-2">About Us</h2>
            <p className="text-sm">
              SiPintar Merupakan sebuah Sistem layanan peminjaman tempat dan barang di Politeknik Statistika STIS yang menyediakan sarana dan prasarana untuk melakukan peminjaman secara online dengan lebih mudah dan cepat.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="w-1/4">
            <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
            <ul className="text-sm">
              {user.role === "Admin" ? (
                <>
                  <li>
                    <Link href="/data-barang" className="hover:underline flex items-center">
                      <FontAwesomeIcon icon={faTable} className="mr-2" />
                      Barang & Tempat
                    </Link>
                  </li>
                  <li>
                    <Link href="/data-peminjaman" className="hover:underline flex items-center">
                      <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                      Data Peminjaman
                    </Link>
                  </li>
                  <li>
                    <Link href="/data-pegawai" className="hover:underline flex items-center">
                      <FontAwesomeIcon icon={faUsers} className="mr-2" />
                      Data Pengguna
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/peminjaman" className="hover:underline flex items-center">
                      <FontAwesomeIcon icon={faHandHolding} className="mr-2" />
                      Peminjaman
                    </Link>
                  </li>
                  <li>
                    <Link href="/list-barang" className="hover:underline flex items-center">
                      <FontAwesomeIcon icon={faList} className="mr-2" />
                      Barang
                    </Link>
                  </li>
                  <li>
                    <Link href="/list-tempat" className="hover:underline flex items-center">
                      <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                      Tempat / Ruangan
                    </Link>
                  </li>
                  <li>
                    <Link href="/riwayat-peminjaman" className="hover:underline flex items-center">
                      <FontAwesomeIcon icon={faHistory} className="mr-2" />
                      Riwayat Peminjaman
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="w-1/4">
            <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
            <p className="text-sm">
              Email: bau@gmail.com <br />
              Phone: +123-456-7890
            </p>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center text-sm mt-8 border-t border-gray-700 pt-4">© 2024 BAU. All rights reserved.</div>
      </div>
    </footer>
  );
}
