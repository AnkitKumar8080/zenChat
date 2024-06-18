import React, { useState } from "react";

const PopupAlert = ({ open, message }) => {
  const [isOpen, setIsOpen] = useState(open || false);

  const toggleAlert = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Alert Title</h2>
            <p className="mb-4">This is an alert message.</p>
            <button
              onClick={toggleAlert}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupAlert;
