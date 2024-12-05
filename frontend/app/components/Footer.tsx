"use client";

import React from "react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          {/* About Us Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">About Us</h2>
            <p className="text-sm">HALO STIS Merupakan sebuah layanan yang menyediakan sarana dan prasarana untuk pengaduan dan peminjaman </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
            <ul className="text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Peminjaman
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Pengaduan
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Riwayat Peminjaman
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Riwayat Pengaduan
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
            <p className="text-sm">
              Email: bau@gmail.com
              <br />
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
