export default function DeleteConfirmationModal({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl mb-4">Konfirmasi Penghapusan</h2>

        <p>Apakah Anda yakin ingin menghapus barang ini?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Batal
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onConfirm}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
