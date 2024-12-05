// "use client";
// import React, { useState } from "react";

// const CustomModal = ({ isOpen, onClose, onConfirm, title, message }) => {
//   const [buktiPengembalian, setBuktiPengembalian] = useState(null);

//   const handleFileChange = (e) => {
//     setBuktiPengembalian(e.target.files[0]);
//   };

//   const handleConfirm = () => {
//     if (buktiPengembalian) {
//       onConfirm(buktiPengembalian); // Pass the file to the parent confirm function
//     } else {
//       alert("Silakan unggah bukti pengembalian terlebih dahulu.");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
//       <div className="bg-white rounded-lg shadow-lg p-6 z-10">
//         <h2 className="text-xl font-bold mb-4">{title}</h2>
//         <p className="mb-4">{message}</p>

//         {/* File upload field */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Upload Bukti Pengembalian</label>
//           <input type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none" />
//         </div>

//         <div className="flex justify-end">
//           <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded mr-2" onClick={onClose}>
//             Batal
//           </button>
//           <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={handleConfirm}>
//             Kembalikan
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomModal;
