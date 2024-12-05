import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// Modal Component for Editing Barang
export default function EditBarangModal({ barang, onClose, onSave }) {
  const [name, setName] = useState(barang.name);
  const [kategoriId, setKategoriId] = useState(barang.kategoriId || ""); // Menyimpan ID kategori yang dipilih
  const [kondisi, setKondisi] = useState(barang.kondisi || "");
  const [available, setAvailable] = useState(barang.available);
  const [lokasi, setLokasi] = useState(barang.lokasi || "");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [kategoriList, setKategoriList] = useState([]); // Menyimpan daftar kategori

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

  const handleSave = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("kategoriId", kategoriId);
    formData.append("kondisi", kondisi);
    formData.append("available", available);
    formData.append("lokasi", lokasi);

    if (photo) {
      formData.append("photo", photo);
    }

    await onSave(barang.id, formData);
    setLoading(false);
  };

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
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium">Kategori</label>
            <select value={kategoriId} onChange={(e) => setKategoriId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500">
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

          <div>
            <label className="block text-sm font-medium">Kondisi</label>
            <input type="text" value={kondisi} onChange={(e) => setKondisi(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium">Tersedia</label>
            <select value={available} onChange={(e) => setAvailable(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500">
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Lokasi</label>
            <input type="text" value={lokasi} onChange={(e) => setLokasi(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium">Photo</label>
            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500" />
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
