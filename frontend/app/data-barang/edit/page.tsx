import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditBarangModal({ barang, onClose, onSave }) {
  const [name, setName] = useState(barang.name);
  const [kategoriId, setKategoriId] = useState(barang.kategoriId || "");
  const [kondisi, setKondisi] = useState(barang.kondisi || "");
  const [available, setAvailable] = useState(barang.available);
  const [lokasi, setLokasi] = useState(barang.lokasi || "");
  const [jumlah, setJumlah] = useState(barang.jumlah || "");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [kategoriList, setKategoriList] = useState([]);

  // Mengambil data kategori dari API
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/kategori");
        const data = await response.json();
        setKategoriList(data);
      } catch (error) {
        console.error("Error fetching kategori:", error);
      }
    };

    fetchKategori();
  }, []);

  // Validasi file gambar
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Validasi tipe file
    if (file && !file.type.startsWith("image/")) {
      toast.error("File yang diupload harus berupa gambar.");
      e.target.value = ""; // Reset input file
      return;
    }

    // Validasi ukuran file (maksimal 2MB)
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file tidak boleh lebih dari 2MB.");
      e.target.value = ""; // Reset input file
      return;
    }

    setPhoto(file);
  };

  const handleSave = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("kategoriId", kategoriId);
    formData.append("kondisi", isTempat ? "" : kondisi); // Set kondisi kosong untuk kategori "tempat"
    formData.append("available", available);
    formData.append("lokasi", isTempat ? "" : lokasi); // Set lokasi kosong untuk kategori "tempat"
    formData.append("jumlah", jumlah);

    if (photo) {
      formData.append("photo", photo);
    }

    await onSave(barang.id, formData);
    setLoading(false);
  };

  // Cek apakah kategori yang dipilih adalah "tempat"
  const isTempat = kategoriList.find((kategori) => kategori.id === parseInt(kategoriId))?.kategori.toLowerCase() === "tempat";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Barang</h2>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Field Nama (Read-only) */}
          <div>
            <label className="block text-sm font-medium">Nama</label>
            <input
              type="text"
              value={name}
              readOnly // Menambahkan atribut readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 bg-gray-100 cursor-not-allowed" // Menambahkan styling untuk menunjukkan bahwa elemen ini tidak dapat diubah
            />
          </div>

          {/* Field Kategori (Disabled) */}
          <div>
            <label className="block text-sm font-medium">Kategori</label>
            <select
              value={kategoriId}
              disabled // Menambahkan atribut disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 bg-gray-100 cursor-not-allowed" // Menambahkan styling untuk menunjukkan bahwa elemen ini tidak dapat diubah
            >
              <option value="" disabled>
                Pilih Kategori
              </option>
              {kategoriList.map((kategori) => (
                <option key={kategori.id} value={kategori.id}>
                  {kategori.kategori}
                </option>
              ))}
            </select>
          </div>

          {/* Tampilkan kolom tersedia hanya jika kategori adalah "tempat" */}
          {isTempat && (
            <div>
              <label className="block text-sm font-medium">Tersedia</label>
              <select value={available} onChange={(e) => setAvailable(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500">
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>
          )}

          {!isTempat && (
            <>
              <div>
                <label className="block text-sm font-medium">Kondisi</label>
                <input type="text" value={kondisi} onChange={(e) => setKondisi(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium">Lokasi</label>
                <input type="text" value={lokasi} onChange={(e) => setLokasi(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500" />
              </div>
            </>
          )}

          {/* Tampilkan kolom jumlah hanya jika kategori bukan "tempat" */}
          {!isTempat && (
            <div>
              <label className="block text-sm font-medium">Jumlah</label>
              <input type="number" value={jumlah} onChange={(e) => setJumlah(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Photo</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              accept="image/*" // Hanya menerima file gambar
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading} className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
