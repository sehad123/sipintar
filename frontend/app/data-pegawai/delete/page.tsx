import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function DeleteConfirmationModal({ user, onClose, onDelete }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Confirm Delete</h2>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Modal Body */}
        <p>Are you sure you want to delete {user.name}?</p>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
            Cancel
          </button>
          <button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
