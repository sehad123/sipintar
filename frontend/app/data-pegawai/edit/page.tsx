"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// Modal Component for Editing Pegawai
export default function EditPegawaiModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [no_hp, setNo_hp] = useState(user.no_hp);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await onSave(user.id, { name, email, no_hp });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Pegawai</h2>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium">No HP</label>
            <input type="number" value={no_hp} onChange={(e) => setNo_hp(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500" />
          </div>
        </div>

        {/* Modal Footer */}
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
